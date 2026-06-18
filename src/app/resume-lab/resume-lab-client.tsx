"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, FileText, Loader2, Save, Sparkles, Trash2 } from "lucide-react";
import type { ResumeConcept, ResumeDraft, TailoredResume } from "@/lib/resume";

type ResumeConceptOption = {
  id: ResumeConcept;
  name: string;
  description: string;
};

type Props = {
  adminToken: string;
  concepts: ResumeConceptOption[];
  initialDrafts: ResumeDraft[];
};

const emptyJob = {
  company: "",
  targetRole: "",
  jobListing: "",
  concept: "classic" as ResumeConcept
};

export function ResumeLabClient({ adminToken, concepts, initialDrafts }: Props) {
  const [job, setJob] = useState(emptyJob);
  const [drafts, setDrafts] = useState<ResumeDraft[]>(initialDrafts);
  const [activeDraft, setActiveDraft] = useState<ResumeDraft | null>(initialDrafts[0] ?? null);
  const [status, setStatus] = useState("Ready");
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    void loadDrafts();
  }, []);

  const activePrintUrl = activeDraft ? `/resume-lab/print/${activeDraft.id}` : "";
  const providerLabel = activeDraft ? `${activeDraft.provider} / ${activeDraft.model}` : "Grok ready";

  async function loadDrafts() {
    try {
      const response = await apiFetch(adminToken, "/api/resume-lab/drafts");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to load drafts");
      }

      setDrafts(data.drafts);
      setActiveDraft((current) => current ?? data.drafts[0] ?? null);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to load drafts");
    }
  }

  async function generateResume() {
    setIsBusy(true);
    setStatus("Generating with Grok...");

    try {
      const response = await apiFetch(adminToken, "/api/resume-lab/generate", {
        method: "POST",
        body: JSON.stringify(job)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to generate resume");
      }

      setActiveDraft(data.draft);
      setDrafts((current) => [data.draft, ...current.filter((draft) => draft.id !== data.draft.id)]);
      setStatus(data.draft.provider === "local" ? "Baseline draft saved. Add XAI_API_KEY to generate with Grok." : "Tailored draft saved.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to generate resume");
    } finally {
      setIsBusy(false);
    }
  }

  async function saveDraft() {
    if (!activeDraft) {
      return;
    }

    setIsBusy(true);
    setStatus("Saving draft...");

    try {
      const response = await apiFetch(adminToken, `/api/resume-lab/drafts/${activeDraft.id}`, {
        method: "PUT",
        body: JSON.stringify(activeDraft)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to save draft");
      }

      setActiveDraft(data.draft);
      setDrafts((current) => [data.draft, ...current.filter((draft) => draft.id !== data.draft.id)]);
      setStatus("Draft saved.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save draft");
    } finally {
      setIsBusy(false);
    }
  }

  async function deleteDraft(id: string) {
    setIsBusy(true);
    setStatus("Deleting draft...");

    try {
      const response = await apiFetch(adminToken, `/api/resume-lab/drafts/${id}`, { method: "DELETE" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to delete draft");
      }

      const nextDrafts = drafts.filter((draft) => draft.id !== id);
      setDrafts(nextDrafts);
      setActiveDraft((current) => (current?.id === id ? nextDrafts[0] ?? null : current));
      setStatus("Draft deleted.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to delete draft");
    } finally {
      setIsBusy(false);
    }
  }

  function updateResume(updater: (resume: TailoredResume) => TailoredResume) {
    setActiveDraft((draft) => (draft ? { ...draft, resume: updater(draft.resume) } : draft));
  }

  const draftAge = useMemo(() => {
    if (!activeDraft) {
      return "";
    }

    return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(activeDraft.updatedAt));
  }, [activeDraft]);

  return (
    <section className="resume-workspace">
      <div className="resume-control-grid">
        <article className="lab-panel">
          <div className="lab-panel-head">
            <div>
              <span className="section-label">Job input</span>
              <h2>Target role</h2>
            </div>
            <FileText size={22} aria-hidden />
          </div>

          <label className="field">
            <span>Company</span>
            <input value={job.company} onChange={(event) => setJob({ ...job, company: event.target.value })} placeholder="Acme AI" />
          </label>
          <label className="field">
            <span>Role</span>
            <input value={job.targetRole} onChange={(event) => setJob({ ...job, targetRole: event.target.value })} placeholder="Senior Full-stack Engineer" />
          </label>
          <label className="field">
            <span>Job listing</span>
            <textarea
              className="job-listing-input"
              value={job.jobListing}
              onChange={(event) => setJob({ ...job, jobListing: event.target.value })}
              placeholder="Paste the full job listing here..."
            />
          </label>

          <div className="resume-concept-grid" aria-label="Resume PDF concepts">
            {concepts.map((concept) => (
              <button
                className={job.concept === concept.id ? "resume-concept selected" : "resume-concept"}
                key={concept.id}
                type="button"
                onClick={() => setJob({ ...job, concept: concept.id })}
              >
                <strong>{concept.name}</strong>
                <span>{concept.description}</span>
              </button>
            ))}
          </div>

          <button className="admin-button lab-primary-action" disabled={isBusy} type="button" onClick={generateResume}>
            {isBusy ? <Loader2 className="spin" size={16} aria-hidden /> : <Sparkles size={16} aria-hidden />}
            Generate tailored resume
          </button>
        </article>

        <article className="lab-panel">
          <div className="lab-panel-head">
            <div>
              <span className="section-label">Drafts</span>
              <h2>History</h2>
            </div>
            <span className="lab-status">{status}</span>
          </div>

          <div className="draft-list">
            {drafts.length === 0 ? <p className="empty-note">Generated drafts will appear here.</p> : null}
            {drafts.map((draft) => (
              <button className={activeDraft?.id === draft.id ? "draft-card active" : "draft-card"} key={draft.id} type="button" onClick={() => setActiveDraft(draft)}>
                <strong>{draft.title}</strong>
                <span>{draft.provider} · {new Date(draft.updatedAt).toLocaleDateString()}</span>
              </button>
            ))}
          </div>

          {activeDraft ? (
            <div className="analysis-panel">
              <div className="analysis-meta">
                <span>{providerLabel}</span>
                <span>Saved {draftAge}</span>
              </div>
              <p>{activeDraft.analysis.matchSummary}</p>
              <h3>Emphasis</h3>
              <TagList items={activeDraft.analysis.emphasizedEvidence} />
              <h3>Keywords</h3>
              <TagList items={activeDraft.analysis.keywordTargets} />
              {activeDraft.analysis.gapsOrCautions.length ? (
                <>
                  <h3>Review before sending</h3>
                  <ul>
                    {activeDraft.analysis.gapsOrCautions.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>
          ) : null}
        </article>
      </div>

      {activeDraft ? (
        <article className="lab-panel resume-editor-panel">
          <div className="lab-panel-head editor-actions">
            <div>
              <span className="section-label">Editable resume</span>
              <h2>{activeDraft.title}</h2>
            </div>
            <div className="resume-actions">
              <button className="admin-button secondary" disabled={isBusy} type="button" onClick={saveDraft}>
                <Save size={16} aria-hidden /> Save edits
              </button>
              <a className="admin-button" href={activePrintUrl} target="_blank" rel="noreferrer">
                <Download size={16} aria-hidden /> Open PDF view
              </a>
              <button className="text-button danger" disabled={isBusy} type="button" onClick={() => void deleteDraft(activeDraft.id)}>
                <Trash2 size={15} aria-hidden /> Delete
              </button>
            </div>
          </div>

          <div className="field-grid two">
            <label className="field">
              <span>Resume concept</span>
              <select value={activeDraft.concept} onChange={(event) => setActiveDraft({ ...activeDraft, concept: event.target.value as ResumeConcept })}>
                {concepts.map((concept) => (
                  <option key={concept.id} value={concept.id}>
                    {concept.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Headline</span>
              <input value={activeDraft.resume.headline} onChange={(event) => updateResume((resume) => ({ ...resume, headline: event.target.value }))} />
            </label>
          </div>

          <label className="field">
            <span>Summary</span>
            <textarea value={activeDraft.resume.summary} onChange={(event) => updateResume((resume) => ({ ...resume, summary: event.target.value }))} />
          </label>

          <EditableSkillGroups resume={activeDraft.resume} onChange={updateResume} />
          <EditableExperience resume={activeDraft.resume} onChange={updateResume} />
          <EditableProjects resume={activeDraft.resume} onChange={updateResume} />
          <EditableEducation resume={activeDraft.resume} onChange={updateResume} />

          <label className="field">
            <span>ATS keywords</span>
            <textarea
              value={activeDraft.resume.keywords.join(", ")}
              onChange={(event) => updateResume((resume) => ({ ...resume, keywords: splitCommaList(event.target.value) }))}
            />
          </label>
        </article>
      ) : null}
    </section>
  );
}

function EditableSkillGroups({ resume, onChange }: { resume: TailoredResume; onChange: (updater: (resume: TailoredResume) => TailoredResume) => void }) {
  return (
    <div className="editable-section">
      <h3>Skills</h3>
      <div className="editable-grid">
        {resume.skills.map((group, index) => (
          <div className="editable-mini-card" key={`${group.title}-${index}`}>
            <label className="field">
              <span>Group title</span>
              <input
                value={group.title}
                onChange={(event) =>
                  onChange((current) => ({
                    ...current,
                    skills: current.skills.map((item, itemIndex) => (itemIndex === index ? { ...item, title: event.target.value } : item))
                  }))
                }
              />
            </label>
            <label className="field">
              <span>Items</span>
              <textarea
                value={group.items.join("\n")}
                onChange={(event) =>
                  onChange((current) => ({
                    ...current,
                    skills: current.skills.map((item, itemIndex) => (itemIndex === index ? { ...item, items: splitLineList(event.target.value) } : item))
                  }))
                }
              />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

function EditableExperience({ resume, onChange }: { resume: TailoredResume; onChange: (updater: (resume: TailoredResume) => TailoredResume) => void }) {
  return (
    <div className="editable-section">
      <h3>Experience</h3>
      {resume.experience.map((item, index) => (
        <div className="editable-mini-card" key={`${item.company}-${item.role}-${index}`}>
          <div className="field-grid three">
            <label className="field">
              <span>Company</span>
              <input value={item.company} onChange={(event) => updateExperienceField(onChange, index, "company", event.target.value)} />
            </label>
            <label className="field">
              <span>Company URL</span>
              <input value={item.companyUrl ?? ""} onChange={(event) => updateExperienceField(onChange, index, "companyUrl", event.target.value)} />
            </label>
            <label className="field">
              <span>Role</span>
              <input value={item.role} onChange={(event) => updateExperienceField(onChange, index, "role", event.target.value)} />
            </label>
            <label className="field">
              <span>Period</span>
              <input value={item.period} onChange={(event) => updateExperienceField(onChange, index, "period", event.target.value)} />
            </label>
            <label className="field">
              <span>Company context</span>
              <input value={item.companyContext ?? ""} onChange={(event) => updateExperienceField(onChange, index, "companyContext", event.target.value)} />
            </label>
          </div>
          <label className="field">
            <span>Bullets</span>
            <textarea value={item.bullets.join("\n")} onChange={(event) => updateExperienceField(onChange, index, "bullets", splitLineList(event.target.value))} />
          </label>
        </div>
      ))}
    </div>
  );
}

function EditableProjects({ resume, onChange }: { resume: TailoredResume; onChange: (updater: (resume: TailoredResume) => TailoredResume) => void }) {
  return (
    <div className="editable-section">
      <h3>Relevant work</h3>
      {resume.projects.map((item, index) => (
        <div className="editable-mini-card" key={`${item.name}-${index}`}>
          <div className="field-grid two">
            <label className="field">
              <span>Name</span>
              <input value={item.name} onChange={(event) => updateProjectField(onChange, index, "name", event.target.value)} />
            </label>
            <label className="field">
              <span>Context</span>
              <input value={item.context} onChange={(event) => updateProjectField(onChange, index, "context", event.target.value)} />
            </label>
          </div>
          <label className="field">
            <span>Bullets</span>
            <textarea value={item.bullets.join("\n")} onChange={(event) => updateProjectField(onChange, index, "bullets", splitLineList(event.target.value))} />
          </label>
        </div>
      ))}
    </div>
  );
}

function EditableEducation({ resume, onChange }: { resume: TailoredResume; onChange: (updater: (resume: TailoredResume) => TailoredResume) => void }) {
  return (
    <div className="editable-section">
      <div className="editable-section-head">
        <h3>Education</h3>
        <button
          className="text-button"
          type="button"
          onClick={() =>
            onChange((current) => ({
              ...current,
              education: [...current.education, { school: "New school", degree: "", period: "", details: [] }]
            }))
          }
        >
          Add education
        </button>
      </div>

      {resume.education.length === 0 ? <p className="empty-note">No education added.</p> : null}
      {resume.education.map((item, index) => (
        <div className="editable-mini-card" key={`${item.school}-${index}`}>
          <div className="field-grid three">
            <label className="field">
              <span>School</span>
              <input value={item.school} onChange={(event) => updateEducationField(onChange, index, "school", event.target.value)} />
            </label>
            <label className="field">
              <span>Degree</span>
              <input value={item.degree} onChange={(event) => updateEducationField(onChange, index, "degree", event.target.value)} />
            </label>
            <label className="field">
              <span>Period</span>
              <input value={item.period} onChange={(event) => updateEducationField(onChange, index, "period", event.target.value)} />
            </label>
          </div>
          <label className="field">
            <span>Details</span>
            <textarea value={item.details.join("\n")} onChange={(event) => updateEducationField(onChange, index, "details", splitLineList(event.target.value))} />
          </label>
        </div>
      ))}
    </div>
  );
}

function TagList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <p className="empty-note">No items yet.</p>;
  }

  return (
    <div className="analysis-tags">
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}

function updateExperienceField<K extends keyof TailoredResume["experience"][number]>(
  onChange: (updater: (resume: TailoredResume) => TailoredResume) => void,
  index: number,
  key: K,
  value: TailoredResume["experience"][number][K]
) {
  onChange((resume) => ({
    ...resume,
    experience: resume.experience.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item))
  }));
}

function updateProjectField<K extends keyof TailoredResume["projects"][number]>(
  onChange: (updater: (resume: TailoredResume) => TailoredResume) => void,
  index: number,
  key: K,
  value: TailoredResume["projects"][number][K]
) {
  onChange((resume) => ({
    ...resume,
    projects: resume.projects.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item))
  }));
}

function updateEducationField<K extends keyof TailoredResume["education"][number]>(
  onChange: (updater: (resume: TailoredResume) => TailoredResume) => void,
  index: number,
  key: K,
  value: TailoredResume["education"][number][K]
) {
  onChange((resume) => ({
    ...resume,
    education: resume.education.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item))
  }));
}

function splitLineList(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitCommaList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function apiFetch(adminToken: string, url: string, init: RequestInit = {}) {
  return fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Token": adminToken,
      ...init.headers
    }
  });
}
