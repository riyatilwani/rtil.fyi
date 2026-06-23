"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { SiteContent } from "@/lib/content";
import { createDefaultPublicResume, resumeEdgeChecklist } from "@/lib/public-resume";
import { resumeConcepts, type ResumeConcept, type TailoredResume } from "@/lib/resume";

type Concept = SiteContent["concept"];
type Tab = "profile" | "experience" | "projects" | "services" | "proof" | "resume";

const concepts: Array<{ id: Concept; name: string; description: string }> = [
  {
    id: "ledger",
    name: "Editorial ledger",
    description: "Warm, minimal, relaxed. The current direction with better hierarchy."
  },
  {
    id: "dossier",
    name: "Technical dossier",
    description: "Sharper recruiter scan, dense proof, product-company credibility."
  },
  {
    id: "canvas",
    name: "Code canvas",
    description: "Darker, more technical, better for AI/backend systems positioning."
  }
];

export default function AdminEditor({
  adminToken,
  initialContent
}: {
  adminToken: string;
  initialContent: SiteContent;
}) {
  const [content, setContent] = useState(initialContent);
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [status, setStatus] = useState("Ready");
  const publicResume = content.resumeLab.publicResume ?? createDefaultPublicResume(content);
  const publicResumeConcept = content.resumeLab.publicResumeConcept ?? "classic";
  const resumeTips = content.resumeLab.resumeTips ?? resumeEdgeChecklist;
  const rawJson = useMemo(() => JSON.stringify(content, null, 2), [content]);

  async function saveContent() {
    setStatus("Saving");

    const apiUrl = `${window.location.protocol}//${window.location.host}/api/content`;
    let response: Response;

    try {
      response = await fetch(apiUrl, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Token": adminToken
        },
        body: JSON.stringify(content)
      });
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Save failed");
      return;
    }

    if (!response.ok) {
      const body = await response.text();
      setStatus(body || "Save failed");
      return;
    }

    setStatus("Saved");
  }

  function resetDraft() {
    setContent(initialContent);
    setStatus("Reset");
  }

  function updateContent<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    setContent((current) => ({ ...current, [key]: value }));
  }

  function updateResumeLab(patch: Partial<SiteContent["resumeLab"]>) {
    updateContent("resumeLab", { ...content.resumeLab, ...patch });
  }

  function updatePublicResume(updater: (resume: TailoredResume) => TailoredResume) {
    updateResumeLab({ publicResume: updater(publicResume) });
  }

  return (
    <main className="admin-shell">
      <div className="admin-layout">
        <aside className="admin-panel admin-sidebar">
          <h1>Admin</h1>
          <p>Edit the client-facing site, switch concepts, and preview the public page from one protected workspace.</p>

          <div className="admin-status">
            <span>{status}</span>
            <a href="/" target="_blank" rel="noreferrer">
              View site
            </a>
          </div>

          <nav className="admin-tabs" aria-label="Admin sections">
            {[
              ["profile", "Profile"],
              ["experience", "Experience"],
              ["projects", "Notable work"],
              ["services", "Services"],
              ["proof", "Proof"],
              ["resume", "Public Resume"]
            ].map(([id, label]) => (
              <button
                className={activeTab === id ? "active" : ""}
                key={id}
                type="button"
                onClick={() => setActiveTab(id as Tab)}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="admin-actions">
            <button className="admin-button secondary" type="button" onClick={resetDraft}>
              Reset
            </button>
            <button className="admin-button" type="button" onClick={saveContent}>
              Save changes
            </button>
          </div>
        </aside>

        <section className="admin-editor">
          {activeTab === "profile" ? (
            <Panel title="Profile and concept">
              <div className="concept-grid">
                {concepts.map((concept) => (
                  <button
                    className={`concept-card ${content.concept === concept.id ? "selected" : ""}`}
                    key={concept.id}
                    type="button"
                    onClick={() => updateContent("concept", concept.id)}
                  >
                    <span>{concept.name}</span>
                    <small>{concept.description}</small>
                  </button>
                ))}
              </div>

              <div className="field-grid two">
                <Field label="Name" value={content.profile.name} onChange={(value) => updateContent("profile", { ...content.profile, name: value })} />
                <Field label="Domain" value={content.profile.domain} onChange={(value) => updateContent("profile", { ...content.profile, domain: value })} />
                <Field label="Title" value={content.profile.title} onChange={(value) => updateContent("profile", { ...content.profile, title: value })} />
                <Field label="Location" value={content.profile.location} onChange={(value) => updateContent("profile", { ...content.profile, location: value })} />
                <Field label="Years" value={content.profile.years} onChange={(value) => updateContent("profile", { ...content.profile, years: value })} />
                <Field label="Email" value={content.profile.email} onChange={(value) => updateContent("profile", { ...content.profile, email: value })} />
              </div>
              <Textarea label="Hero summary" value={content.profile.summary} onChange={(value) => updateContent("profile", { ...content.profile, summary: value })} />
              <Textarea label="Availability" value={content.profile.availability} onChange={(value) => updateContent("profile", { ...content.profile, availability: value })} />

              <div className="field-grid three">
                <Field label="LinkedIn" value={content.profile.links.linkedin} onChange={(value) => updateContent("profile", { ...content.profile, links: { ...content.profile.links, linkedin: value } })} />
                <Field label="GitHub" value={content.profile.links.github} onChange={(value) => updateContent("profile", { ...content.profile, links: { ...content.profile.links, github: value } })} />
                <Field label="Upwork" value={content.profile.links.upwork} onChange={(value) => updateContent("profile", { ...content.profile, links: { ...content.profile.links, upwork: value } })} />
              </div>

              <TagTextarea label="Company strip" values={content.credibility} onChange={(values) => updateContent("credibility", values)} />
              <TagTextarea label="Positioning" values={content.positioning} onChange={(values) => updateContent("positioning", values)} />
              <TagTextarea label="Open to" values={content.openTo} onChange={(values) => updateContent("openTo", values)} />
            </Panel>
          ) : null}

          {activeTab === "experience" ? (
            <Panel
              title="Experience"
              action={
                <button className="admin-button secondary" type="button" onClick={() => updateContent("experience", [...content.experience, emptyExperience()])}>
                  Add role
                </button>
              }
            >
              {content.experience.map((item, index) => (
                <EditableBlock
                  key={`${item.company}-${index}`}
                  title={item.company || "New role"}
                  onRemove={() => updateContent("experience", removeAt(content.experience, index))}
                >
                  <div className="field-grid two">
                    <Field label="Company" value={item.company} onChange={(value) => updateContent("experience", patchAt(content.experience, index, { company: value }))} />
                    <Field label="Role" value={item.role} onChange={(value) => updateContent("experience", patchAt(content.experience, index, { role: value }))} />
                    <Field label="Period" value={item.period} onChange={(value) => updateContent("experience", patchAt(content.experience, index, { period: value }))} />
                    <Field label="Location" value={item.location} onChange={(value) => updateContent("experience", patchAt(content.experience, index, { location: value }))} />
                    <Field label="Company URL" value={item.companyUrl ?? ""} onChange={(value) => updateContent("experience", patchAt(content.experience, index, { companyUrl: value }))} />
                    <Field label="Company context" value={item.companyContext ?? ""} onChange={(value) => updateContent("experience", patchAt(content.experience, index, { companyContext: value }))} />
                  </div>
                  <Field label="Context" value={item.context} onChange={(value) => updateContent("experience", patchAt(content.experience, index, { context: value }))} />
                  <Textarea label="Description" value={item.description} onChange={(value) => updateContent("experience", patchAt(content.experience, index, { description: value }))} />
                  <TagTextarea label="Highlights" values={item.highlights} onChange={(values) => updateContent("experience", patchAt(content.experience, index, { highlights: values }))} />
                  <TagTextarea label="Stack" values={item.stack} onChange={(values) => updateContent("experience", patchAt(content.experience, index, { stack: values }))} />
                </EditableBlock>
              ))}
            </Panel>
          ) : null}

          {activeTab === "projects" ? (
            <Panel
              title="Notable work / case studies"
              action={
                <button className="admin-button secondary" type="button" onClick={() => updateContent("projects", [...content.projects, emptyProject()])}>
                  Add case study
                </button>
              }
            >
              {content.projects.map((item, index) => (
                <EditableBlock
                  key={`${item.name}-${index}`}
                  title={item.name || "New project"}
                  onRemove={() => updateContent("projects", removeAt(content.projects, index))}
                >
                  <div className="field-grid two">
                    <Field label="Case title shown on site" value={item.name} onChange={(value) => updateContent("projects", patchAt(content.projects, index, { name: value }))} />
                    <Field label="Client/company shown in left rail" value={item.client} onChange={(value) => updateContent("projects", patchAt(content.projects, index, { client: value }))} />
                    <Field label="Your role shown in left rail" value={item.role} onChange={(value) => updateContent("projects", patchAt(content.projects, index, { role: value }))} />
                    <Field label="Year" value={item.year} onChange={(value) => updateContent("projects", patchAt(content.projects, index, { year: value }))} />
                    <Field label="Area shown in left rail" value={item.theme} onChange={(value) => updateContent("projects", patchAt(content.projects, index, { theme: value }))} />
                  </div>
                  <Textarea label="Paragraph 1 shown on site" value={item.summary} onChange={(value) => updateContent("projects", patchAt(content.projects, index, { summary: value }))} />
                  <Textarea label="Paragraph 2 shown on site" value={item.challenge} onChange={(value) => updateContent("projects", patchAt(content.projects, index, { challenge: value }))} />
                  <Textarea label="Paragraph 3 shown on site" value={item.outcome} onChange={(value) => updateContent("projects", patchAt(content.projects, index, { outcome: value }))} />
                  <TagTextarea label="Skill/tech pills" values={item.stack} onChange={(values) => updateContent("projects", patchAt(content.projects, index, { stack: values }))} />
                </EditableBlock>
              ))}
            </Panel>
          ) : null}

          {activeTab === "services" ? (
            <Panel title="Services">
              {content.services.map((item, index) => (
                <EditableBlock key={`${item.title}-${index}`} title={item.title} onRemove={() => updateContent("services", removeAt(content.services, index))}>
                  <Field label="Title" value={item.title} onChange={(value) => updateContent("services", patchAt(content.services, index, { title: value }))} />
                  <Textarea label="Description" value={item.description} onChange={(value) => updateContent("services", patchAt(content.services, index, { description: value }))} />
                  <Textarea label="Proof" value={item.proof} onChange={(value) => updateContent("services", patchAt(content.services, index, { proof: value }))} />
                </EditableBlock>
              ))}
              <button className="admin-button secondary" type="button" onClick={() => updateContent("services", [...content.services, { title: "New service", description: "", proof: "" }])}>
                Add service
              </button>
            </Panel>
          ) : null}

          {activeTab === "proof" ? (
            <Panel title="Testimonials and GitHub">
              <h2 className="admin-subhead">Testimonials</h2>
              {content.testimonials.map((item, index) => (
                <EditableBlock key={`${item.author}-${index}`} title={item.author} onRemove={() => updateContent("testimonials", removeAt(content.testimonials, index))}>
                  <Textarea label="Quote" value={item.quote} onChange={(value) => updateContent("testimonials", patchAt(content.testimonials, index, { quote: value }))} />
                  <div className="field-grid three">
                    <Field label="Author" value={item.author} onChange={(value) => updateContent("testimonials", patchAt(content.testimonials, index, { author: value }))} />
                    <Field label="Role" value={item.role} onChange={(value) => updateContent("testimonials", patchAt(content.testimonials, index, { role: value }))} />
                    <Field label="Date" value={item.date} onChange={(value) => updateContent("testimonials", patchAt(content.testimonials, index, { date: value }))} />
                  </div>
                </EditableBlock>
              ))}
              <button className="admin-button secondary" type="button" onClick={() => updateContent("testimonials", [...content.testimonials, { quote: "", author: "New client", role: "", date: "" }])}>
                Add testimonial
              </button>

              <h2 className="admin-subhead">GitHub</h2>
              {content.github.map((item, index) => (
                <EditableBlock key={`${item.name}-${index}`} title={item.name} onRemove={() => updateContent("github", removeAt(content.github, index))}>
                  <Field label="Repository" value={item.name} onChange={(value) => updateContent("github", patchAt(content.github, index, { name: value }))} />
                  <Field label="URL" value={item.url} onChange={(value) => updateContent("github", patchAt(content.github, index, { url: value }))} />
                  <Textarea label="Description" value={item.description} onChange={(value) => updateContent("github", patchAt(content.github, index, { description: value }))} />
                  <TagTextarea label="Stack" values={item.stack} onChange={(values) => updateContent("github", patchAt(content.github, index, { stack: values }))} />
                </EditableBlock>
              ))}
              <button className="admin-button secondary" type="button" onClick={() => updateContent("github", [...content.github, { name: "new-repo", description: "", url: "", stack: [] }])}>
                Add repo
              </button>
            </Panel>
          ) : null}

          {activeTab === "resume" ? (
            <Panel
              title="Public resume and Resume Lab"
              action={
                <div className="admin-inline-actions">
                  <a className="admin-button secondary" href="/resume.pdf" target="_blank" rel="noreferrer">
                    Download PDF
                  </a>
                  <button className="admin-button secondary" type="button" onClick={() => updateResumeLab({ publicResume: createDefaultPublicResume(content) })}>
                    Reset public resume
                  </button>
                </div>
              }
            >
              <h2 className="admin-subhead">Public resume</h2>
              <label className="field">
                <span>PDF visual concept</span>
                <select value={publicResumeConcept} onChange={(event) => updateResumeLab({ publicResumeConcept: event.target.value as ResumeConcept })}>
                  {resumeConcepts.map((concept) => (
                    <option key={concept.id} value={concept.id}>
                      {concept.name}
                    </option>
                  ))}
                </select>
              </label>
              <Field label="Headline" value={publicResume.headline} onChange={(value) => updatePublicResume((resume) => ({ ...resume, headline: value }))} />
              <Textarea label="Summary" value={publicResume.summary} onChange={(value) => updatePublicResume((resume) => ({ ...resume, summary: value }))} />

              <EditableResumeSkillGroups resume={publicResume} onChange={updatePublicResume} />
              <EditableResumeExperience resume={publicResume} onChange={updatePublicResume} />
              <EditableResumeProjects resume={publicResume} onChange={updatePublicResume} />
              <EditableResumeEducation resume={publicResume} onChange={updatePublicResume} />
              <TagTextarea label="ATS keywords kept for tailoring, not printed as a separate resume section" values={publicResume.keywords} onChange={(values) => updatePublicResume((resume) => ({ ...resume, keywords: values }))} />

              <h2 className="admin-subhead">Private Resume Lab</h2>
              <Textarea label="Resume lab summary" value={content.resumeLab.summary} onChange={(value) => updateContent("resumeLab", { ...content.resumeLab, summary: value })} />
              <TagTextarea label="Resume principles" values={content.resumeLab.principles} onChange={(values) => updateContent("resumeLab", { ...content.resumeLab, principles: values })} />
              <TagTextarea label="Resume edge checklist" values={resumeTips} onChange={(values) => updateResumeLab({ resumeTips: values })} />
              <details className="raw-json">
                <summary>Advanced JSON preview</summary>
                <textarea readOnly value={rawJson} />
              </details>
            </Panel>
          ) : null}
        </section>
      </div>
    </main>
  );
}

function Panel({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <div className="admin-panel admin-form-panel">
      <div className="editor-toolbar">
        <h1>{title}</h1>
        {action}
      </div>
      {children}
    </div>
  );
}

function EditableBlock({ title, onRemove, children }: { title: string; onRemove: () => void; children: ReactNode }) {
  return (
    <section className="editable-block">
      <div className="editable-block-head">
        <h2>{title}</h2>
        <button className="text-button" type="button" onClick={onRemove}>
          Remove
        </button>
      </div>
      {children}
    </section>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="field">
      <span>{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function TagTextarea({ label, values, onChange }: { label: string; values: string[]; onChange: (value: string[]) => void }) {
  return (
    <label className="field">
      <span>{label} <small>one per line</small></span>
      <LineListTextarea values={values} onChange={onChange} />
    </label>
  );
}

function LineListTextarea({ values, onChange }: { values: string[]; onChange: (value: string[]) => void }) {
  const serialized = values.join("\n");
  const [draft, setDraft] = useState(serialized);

  useEffect(() => {
    setDraft(serialized);
  }, [serialized]);

  return (
    <textarea
      value={draft}
      onChange={(event) => {
        const value = event.target.value;
        setDraft(value);
        onChange(lines(value));
      }}
    />
  );
}

function EditableResumeSkillGroups({ resume, onChange }: { resume: TailoredResume; onChange: (updater: (resume: TailoredResume) => TailoredResume) => void }) {
  return (
    <>
      <h2 className="admin-subhead">Skill groups</h2>
      {resume.skills.map((group, index) => (
        <EditableBlock
          key={`${group.title}-${index}`}
          title={group.title || "Skill group"}
          onRemove={() => onChange((current) => ({ ...current, skills: removeAt(current.skills, index) }))}
        >
          <Field label="Group title" value={group.title} onChange={(value) => onChange((current) => ({ ...current, skills: patchAt(current.skills, index, { title: value }) }))} />
          <TagTextarea label="Items" values={group.items} onChange={(items) => onChange((current) => ({ ...current, skills: patchAt(current.skills, index, { items }) }))} />
        </EditableBlock>
      ))}
      <button className="admin-button secondary" type="button" onClick={() => onChange((current) => ({ ...current, skills: [...current.skills, { title: "New skill group", items: [] }] }))}>
        Add skill group
      </button>
    </>
  );
}

function EditableResumeExperience({ resume, onChange }: { resume: TailoredResume; onChange: (updater: (resume: TailoredResume) => TailoredResume) => void }) {
  return (
    <>
      <h2 className="admin-subhead">Resume experience</h2>
      {resume.experience.map((item, index) => (
        <EditableBlock
          key={`${item.company}-${item.role}-${index}`}
          title={item.company || "Experience"}
          onRemove={() => onChange((current) => ({ ...current, experience: removeAt(current.experience, index) }))}
        >
          <div className="field-grid two">
            <Field label="Company" value={item.company} onChange={(value) => onChange((current) => ({ ...current, experience: patchAt(current.experience, index, { company: value }) }))} />
            <Field label="Role" value={item.role} onChange={(value) => onChange((current) => ({ ...current, experience: patchAt(current.experience, index, { role: value }) }))} />
            <Field label="Period" value={item.period} onChange={(value) => onChange((current) => ({ ...current, experience: patchAt(current.experience, index, { period: value }) }))} />
            <Field label="Company URL" value={item.companyUrl ?? ""} onChange={(value) => onChange((current) => ({ ...current, experience: patchAt(current.experience, index, { companyUrl: value }) }))} />
          </div>
          <Field label="Company context" value={item.companyContext ?? ""} onChange={(value) => onChange((current) => ({ ...current, experience: patchAt(current.experience, index, { companyContext: value }) }))} />
          <TagTextarea label="Bullets" values={item.bullets} onChange={(bullets) => onChange((current) => ({ ...current, experience: patchAt(current.experience, index, { bullets }) }))} />
        </EditableBlock>
      ))}
      <button className="admin-button secondary" type="button" onClick={() => onChange((current) => ({ ...current, experience: [...current.experience, emptyResumeExperience()] }))}>
        Add resume role
      </button>
    </>
  );
}

function EditableResumeProjects({ resume, onChange }: { resume: TailoredResume; onChange: (updater: (resume: TailoredResume) => TailoredResume) => void }) {
  return (
    <>
      <h2 className="admin-subhead">Projects</h2>
      {resume.projects.map((item, index) => (
        <EditableBlock
          key={`${item.name}-${index}`}
          title={item.name || "Selected work"}
          onRemove={() => onChange((current) => ({ ...current, projects: removeAt(current.projects, index) }))}
        >
          <Field label="Name" value={item.name} onChange={(value) => onChange((current) => ({ ...current, projects: patchAt(current.projects, index, { name: value }) }))} />
          <Field label="Context" value={item.context} onChange={(value) => onChange((current) => ({ ...current, projects: patchAt(current.projects, index, { context: value }) }))} />
          <TagTextarea label="Bullets" values={item.bullets} onChange={(bullets) => onChange((current) => ({ ...current, projects: patchAt(current.projects, index, { bullets }) }))} />
        </EditableBlock>
      ))}
      <button className="admin-button secondary" type="button" onClick={() => onChange((current) => ({ ...current, projects: [...current.projects, { name: "New project", context: "", bullets: [] }] }))}>
        Add project
      </button>
    </>
  );
}

function EditableResumeEducation({ resume, onChange }: { resume: TailoredResume; onChange: (updater: (resume: TailoredResume) => TailoredResume) => void }) {
  return (
    <>
      <h2 className="admin-subhead">Resume education</h2>
      {resume.education.map((item, index) => (
        <EditableBlock
          key={`${item.school}-${index}`}
          title={item.school || "Education"}
          onRemove={() => onChange((current) => ({ ...current, education: removeAt(current.education, index) }))}
        >
          <div className="field-grid two">
            <Field label="School" value={item.school} onChange={(value) => onChange((current) => ({ ...current, education: patchAt(current.education, index, { school: value }) }))} />
            <Field label="Degree" value={item.degree} onChange={(value) => onChange((current) => ({ ...current, education: patchAt(current.education, index, { degree: value }) }))} />
            <Field label="Period" value={item.period} onChange={(value) => onChange((current) => ({ ...current, education: patchAt(current.education, index, { period: value }) }))} />
          </div>
          <TagTextarea label="Details" values={item.details} onChange={(details) => onChange((current) => ({ ...current, education: patchAt(current.education, index, { details }) }))} />
        </EditableBlock>
      ))}
      <button className="admin-button secondary" type="button" onClick={() => onChange((current) => ({ ...current, education: [...current.education, emptyEducation()] }))}>
        Add education
      </button>
    </>
  );
}

function lines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function patchAt<T>(items: T[], index: number, patch: Partial<T>) {
  return items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item));
}

function removeAt<T>(items: T[], index: number) {
  return items.filter((_, itemIndex) => itemIndex !== index);
}

function emptyExperience(): SiteContent["experience"][number] {
  return {
    company: "New company",
    companyUrl: "",
    companyContext: "",
    role: "",
    period: "",
    location: "",
    context: "",
    description: "",
    highlights: [],
    stack: []
  };
}

function emptyProject(): SiteContent["projects"][number] {
  return {
    name: "New project",
    client: "",
    role: "",
    year: "",
    theme: "",
    summary: "",
    challenge: "",
    outcome: "",
    stack: []
  };
}

function emptyEducation(): SiteContent["education"][number] {
  return {
    school: "New school",
    degree: "",
    period: "",
    details: []
  };
}

function emptyResumeExperience(): TailoredResume["experience"][number] {
  return {
    company: "New company",
    companyUrl: "",
    companyContext: "",
    role: "",
    period: "",
    bullets: []
  };
}
