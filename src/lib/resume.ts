import type { SiteContent } from "./content";

export type ResumeConcept = "classic" | "technical" | "compact";

export type ResumeProfile = {
  name: string;
  title: string;
  email: string;
  location: string;
  links: Array<{ label: string; url: string }>;
};

export type TailoredResume = {
  profile: ResumeProfile;
  headline: string;
  summary: string;
  skills: Array<{ title: string; items: string[] }>;
  experience: Array<{
    company: string;
    companyUrl?: string;
    companyContext?: string;
    role: string;
    period: string;
    bullets: string[];
  }>;
  projects: Array<{
    name: string;
    context: string;
    bullets: string[];
  }>;
  education: Array<{
    school: string;
    degree: string;
    period: string;
    details: string[];
  }>;
  keywords: string[];
  notes: string[];
};

export type ResumeAnalysis = {
  targetRole: string;
  company: string;
  matchSummary: string;
  emphasizedEvidence: string[];
  keywordTargets: string[];
  gapsOrCautions: string[];
};

export type ResumeDraft = {
  id: string;
  title: string;
  company: string;
  targetRole: string;
  jobListing: string;
  concept: ResumeConcept;
  resume: TailoredResume;
  analysis: ResumeAnalysis;
  provider: string;
  model: string;
  tokenUsage: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateResumeInput = {
  company: string;
  targetRole: string;
  jobListing: string;
  concept: ResumeConcept;
};

export const resumeConcepts: Array<{
  id: ResumeConcept;
  name: string;
  description: string;
}> = [
  {
    id: "classic",
    name: "ATS Classic",
    description: "Warm, restrained resume with a clear section rail for recruiter scanning."
  },
  {
    id: "technical",
    name: "Technical Dossier",
    description: "Cooler systems-focused variant with stronger technical hierarchy."
  },
  {
    id: "compact",
    name: "Startup Compact",
    description: "Tighter single-column variant for fast founder or hiring-manager review."
  }
];

export function isResumeConcept(value: unknown): value is ResumeConcept {
  return value === "classic" || value === "technical" || value === "compact";
}

export function createBaselineResume(content: SiteContent, input: CreateResumeInput): TailoredResume {
  const allSkills = Array.from(
    new Set([
      ...content.positioning,
      ...content.services.flatMap((service) => [service.title, ...service.proof.split(",").map((item) => item.trim())]),
      ...content.experience.flatMap((item) => item.stack),
      ...content.projects.flatMap((project) => project.stack)
    ])
  ).filter(Boolean);

  return {
    profile: {
      name: content.profile.name,
      title: content.profile.title,
      email: content.profile.email,
      location: content.profile.location,
      links: [
        { label: "LinkedIn", url: content.profile.links.linkedin },
        { label: "GitHub", url: content.profile.links.github }
      ]
    },
    headline: `${content.profile.title} | ${input.targetRole}`,
    summary: content.profile.summary,
    skills: [
      { title: "Product and backend", items: allSkills.slice(0, 10) },
      { title: "AI and automation", items: allSkills.filter((skill) => /ai|llm|grok|openai|workflow|automation|agent|whisper/i.test(skill)).slice(0, 10) },
      { title: "Architecture and delivery", items: ["System design", "API design", "Data modelling", "DevOps ownership", "Technical direction", "Cross-functional delivery"] }
    ].filter((group) => group.items.length > 0),
    experience: content.experience.slice(0, 5).map((item) => ({
      company: item.company,
      companyUrl: item.companyUrl,
      companyContext: item.companyContext,
      role: item.role,
      period: item.period,
      bullets: [item.description, ...item.highlights].slice(0, 4)
    })),
    projects: content.projects.slice(0, 4).map((project) => ({
      name: project.name,
      context: `${project.client} | ${project.theme}`,
      bullets: [project.summary, project.challenge, project.outcome]
    })),
    education: content.education ?? [],
    keywords: allSkills.slice(0, 24),
    notes: ["Baseline draft generated from stored portfolio content. Review and tailor before sending."]
  };
}

export function createBaselineAnalysis(content: SiteContent, input: CreateResumeInput): ResumeAnalysis {
  return {
    targetRole: input.targetRole,
    company: input.company,
    matchSummary: `Baseline match for ${input.targetRole || "the target role"} using stored experience across ${content.credibility.slice(0, 4).join(", ")}.`,
    emphasizedEvidence: content.projects.slice(0, 4).map((project) => `${project.name}: ${project.theme}`),
    keywordTargets: extractKeywords(input.jobListing).slice(0, 18),
    gapsOrCautions: ["Review the draft for role-specific emphasis before exporting."]
  };
}

export function normalizeResumeDraft(draft: ResumeDraft): ResumeDraft {
  return {
    ...draft,
    concept: isResumeConcept(draft.concept) ? draft.concept : "classic",
    resume: {
      ...draft.resume,
      skills: draft.resume.skills ?? [],
      experience: draft.resume.experience ?? [],
      projects: draft.resume.projects ?? [],
      education: draft.resume.education ?? [],
      keywords: draft.resume.keywords ?? [],
      notes: draft.resume.notes ?? []
    },
    analysis: {
      ...draft.analysis,
      emphasizedEvidence: draft.analysis.emphasizedEvidence ?? [],
      keywordTargets: draft.analysis.keywordTargets ?? [],
      gapsOrCautions: draft.analysis.gapsOrCautions ?? []
    }
  };
}

function extractKeywords(text: string) {
  const common = new Set(["and", "the", "with", "for", "you", "our", "are", "will", "that", "this", "from", "have", "role"]);

  return Array.from(
    new Set(
      text
        .toLowerCase()
        .replace(/[^a-z0-9+#. ]/g, " ")
        .split(/\s+/)
        .filter((word) => word.length > 2 && !common.has(word))
    )
  );
}
