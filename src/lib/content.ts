import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import type { ResumeConcept, TailoredResume } from "./resume";

export type SiteContent = {
  concept: "ledger" | "dossier" | "canvas";
  profile: {
    name: string;
    domain: string;
    title: string;
    location: string;
    years: string;
    email: string;
    summary: string;
    availability: string;
    links: Record<"github" | "linkedin" | "upwork", string>;
  };
  education: Array<{
    school: string;
    degree: string;
    period: string;
    details: string[];
  }>;
  credibility: string[];
  positioning: string[];
  services: Array<{ title: string; description: string; proof: string }>;
  projects: Array<{
    name: string;
    client: string;
    role: string;
    year: string;
    theme: string;
    summary: string;
    challenge: string;
    outcome: string;
    stack: string[];
  }>;
  experience: Array<{
    company: string;
    companyUrl?: string;
    companyContext?: string;
    role: string;
    period: string;
    location: string;
    context: string;
    description: string;
    highlights: string[];
    stack: string[];
  }>;
  testimonials: Array<{
    quote: string;
    author: string;
    role: string;
    date: string;
  }>;
  github: Array<{
    name: string;
    description: string;
    url: string;
    stack: string[];
  }>;
  openTo: string[];
  resumeLab: {
    summary: string;
    principles: string[];
    resumeTips?: string[];
    publicResumeConcept?: ResumeConcept;
    publicResume?: TailoredResume;
  };
};

export const contentPath = path.join(process.cwd(), "data", "site.json");

let sqlClient: NeonQueryFunction<false, false> | null = null;
let tableReady = false;
let databaseUnavailable = false;

export async function getSiteContent(): Promise<SiteContent> {
  if (!shouldUseDatabase()) {
    return readFileContent();
  }

  try {
    const sql = await getSql();
    const rows = (await sql`
      SELECT content
      FROM site_content
      WHERE id = ${"main"}
      LIMIT 1
    `) as Array<{ content: unknown }>;

    if (rows[0]?.content) {
      return rows[0].content as SiteContent;
    }
  } catch (error) {
    if (!useFileFallback("read site content", error)) {
      throw error;
    }
  }

  return readFileContent();
}

export async function saveSiteContent(content: SiteContent) {
  if (!shouldUseDatabase()) {
    await writeFileContent(content);
    return "filesystem";
  }

  try {
    const sql = await getSql();
    await sql`
      INSERT INTO site_content (id, content, updated_at)
      VALUES (${"main"}, ${JSON.stringify(content)}::jsonb, NOW())
      ON CONFLICT (id) DO UPDATE SET
        content = EXCLUDED.content,
        updated_at = EXCLUDED.updated_at
    `;
    return "database";
  } catch (error) {
    if (useFileFallback("save site content", error)) {
      await writeFileContent(content);
      return "filesystem";
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

function useFileFallback(action: string, error: unknown) {
  if (process.env.NODE_ENV === "production") {
    return false;
  }

  databaseUnavailable = true;
  const message = error instanceof Error ? error.message : String(error);
  console.warn(`[content] Neon unavailable during ${action}; using local JSON content. ${message}`);
  return true;
}

async function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured. Add a Neon Postgres database for production content storage.");
  }

  if (!sqlClient) {
    sqlClient = neon(process.env.DATABASE_URL);
  }

  if (!tableReady) {
    await sqlClient`
      CREATE TABLE IF NOT EXISTS site_content (
        id TEXT PRIMARY KEY,
        content JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    tableReady = true;
  }

  return sqlClient;
}

async function readFileContent() {
  const file = await readFile(contentPath, "utf8");
  return JSON.parse(file) as SiteContent;
}

async function writeFileContent(content: SiteContent) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("DATABASE_URL is required for production content editing.");
  }

  await mkdir(path.dirname(contentPath), { recursive: true });
  await writeFile(contentPath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
}
