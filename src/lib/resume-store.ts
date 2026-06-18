import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { isResumeConcept, normalizeResumeDraft, type ResumeDraft } from "./resume";

const localDraftPath = path.join(process.cwd(), "data", "resume-drafts.json");

let sqlClient: NeonQueryFunction<false, false> | null = null;
let tableReady = false;
let databaseUnavailable = false;

type DraftRow = {
  id: string;
  title: string;
  company: string;
  target_role: string;
  job_listing: string;
  concept: string;
  resume: unknown;
  analysis: unknown;
  provider: string;
  model: string;
  token_usage: unknown;
  created_at: Date | string;
  updated_at: Date | string;
};

export async function listResumeDrafts() {
  if (!shouldUseDatabase()) {
    return readLocalDrafts();
  }

  try {
    const sql = await getSql();
    const rows = (await sql`
      SELECT *
      FROM resume_drafts
      ORDER BY updated_at DESC
      LIMIT 40
    `) as DraftRow[];

    return rows.map(rowToDraft);
  } catch (error) {
    if (useLocalDraftFallback("list resume drafts", error)) {
      return readLocalDrafts();
    }

    throw error;
  }
}

export async function getResumeDraft(id: string) {
  if (!shouldUseDatabase()) {
    return (await readLocalDrafts()).find((draft) => draft.id === id) ?? null;
  }

  try {
    const sql = await getSql();
    const rows = (await sql`
      SELECT *
      FROM resume_drafts
      WHERE id = ${id}
      LIMIT 1
    `) as DraftRow[];

    return rows[0] ? rowToDraft(rows[0]) : null;
  } catch (error) {
    if (useLocalDraftFallback("get resume draft", error)) {
      return (await readLocalDrafts()).find((draft) => draft.id === id) ?? null;
    }

    throw error;
  }
}

export async function createResumeDraft(draft: ResumeDraft) {
  const normalized = normalizeResumeDraft(draft);

  if (!shouldUseDatabase()) {
    const drafts = await readLocalDrafts();
    await writeLocalDrafts([normalized, ...drafts.filter((item) => item.id !== normalized.id)]);
    return normalized;
  }

  try {
    const sql = await getSql();
    await sql`
      INSERT INTO resume_drafts (
        id,
        title,
        company,
        target_role,
        job_listing,
        concept,
        resume,
        analysis,
        provider,
        model,
        token_usage,
        created_at,
        updated_at
      )
      VALUES (
        ${normalized.id},
        ${normalized.title},
        ${normalized.company},
        ${normalized.targetRole},
        ${normalized.jobListing},
        ${normalized.concept},
        ${JSON.stringify(normalized.resume)}::jsonb,
        ${JSON.stringify(normalized.analysis)}::jsonb,
        ${normalized.provider},
        ${normalized.model},
        ${JSON.stringify(normalized.tokenUsage)}::jsonb,
        ${normalized.createdAt},
        ${normalized.updatedAt}
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        company = EXCLUDED.company,
        target_role = EXCLUDED.target_role,
        job_listing = EXCLUDED.job_listing,
        concept = EXCLUDED.concept,
        resume = EXCLUDED.resume,
        analysis = EXCLUDED.analysis,
        provider = EXCLUDED.provider,
        model = EXCLUDED.model,
        token_usage = EXCLUDED.token_usage,
        updated_at = EXCLUDED.updated_at
    `;
  } catch (error) {
    if (useLocalDraftFallback("save resume draft", error)) {
      const drafts = await readLocalDrafts();
      await writeLocalDrafts([normalized, ...drafts.filter((item) => item.id !== normalized.id)]);
      return normalized;
    }

    throw error;
  }

  return normalized;
}

export async function updateResumeDraft(id: string, patch: Partial<ResumeDraft>) {
  const existing = await getResumeDraft(id);

  if (!existing) {
    return null;
  }

  const updated = normalizeResumeDraft({
    ...existing,
    ...patch,
    id,
    updatedAt: new Date().toISOString()
  });

  return createResumeDraft(updated);
}

export async function deleteResumeDraft(id: string) {
  if (!shouldUseDatabase()) {
    const drafts = await readLocalDrafts();
    await writeLocalDrafts(drafts.filter((draft) => draft.id !== id));
    return;
  }

  try {
    const sql = await getSql();
    await sql`
      DELETE FROM resume_drafts
      WHERE id = ${id}
    `;
  } catch (error) {
    if (useLocalDraftFallback("delete resume draft", error)) {
      const drafts = await readLocalDrafts();
      await writeLocalDrafts(drafts.filter((draft) => draft.id !== id));
      return;
    }

    throw error;
  }
}

function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

function shouldUseDatabase() {
  return hasDatabase() && !(databaseUnavailable && process.env.NODE_ENV !== "production");
}

function useLocalDraftFallback(action: string, error: unknown) {
  if (process.env.NODE_ENV === "production") {
    return false;
  }

  databaseUnavailable = true;
  const message = error instanceof Error ? error.message : String(error);
  console.warn(`[resume-store] Neon unavailable during ${action}; using local JSON draft storage. ${message}`);
  return true;
}

async function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured. Add a Neon Postgres database for production draft storage.");
  }

  if (!sqlClient) {
    sqlClient = neon(process.env.DATABASE_URL);
  }

  if (!tableReady) {
    await sqlClient`
      CREATE TABLE IF NOT EXISTS resume_drafts (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        target_role TEXT NOT NULL,
        job_listing TEXT NOT NULL,
        concept TEXT NOT NULL DEFAULT 'classic',
        resume JSONB NOT NULL,
        analysis JSONB NOT NULL,
        provider TEXT NOT NULL,
        model TEXT NOT NULL,
        token_usage JSONB,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    await sqlClient`
      CREATE INDEX IF NOT EXISTS resume_drafts_updated_at_idx
        ON resume_drafts (updated_at DESC)
    `;
    tableReady = true;
  }

  return sqlClient;
}

async function readLocalDrafts(): Promise<ResumeDraft[]> {
  if (process.env.NODE_ENV === "production") {
    throw new Error("DATABASE_URL is required for production resume draft storage.");
  }

  try {
    const file = await readFile(localDraftPath, "utf8");
    return (JSON.parse(file) as ResumeDraft[]).map(normalizeResumeDraft);
  } catch {
    return [];
  }
}

async function writeLocalDrafts(drafts: ResumeDraft[]) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("DATABASE_URL is required for production resume draft storage.");
  }

  await mkdir(path.dirname(localDraftPath), { recursive: true });
  await writeFile(localDraftPath, `${JSON.stringify(drafts, null, 2)}\n`);
}

function rowToDraft(row: DraftRow): ResumeDraft {
  return normalizeResumeDraft({
    id: row.id,
    title: row.title,
    company: row.company,
    targetRole: row.target_role,
    jobListing: row.job_listing,
    concept: isResumeConcept(row.concept) ? row.concept : "classic",
    resume: row.resume as ResumeDraft["resume"],
    analysis: row.analysis as ResumeDraft["analysis"],
    provider: row.provider,
    model: row.model,
    tokenUsage: (row.token_usage as Record<string, unknown> | null) ?? null,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString()
  });
}
