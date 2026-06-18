import type { SiteContent } from "./content";
import {
  createBaselineAnalysis,
  createBaselineResume,
  type CreateResumeInput,
  type ResumeAnalysis,
  type TailoredResume
} from "./resume";

type ChatMessage = {
  role: "system" | "user";
  content: string;
};

type ChatResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  usage?: Record<string, unknown>;
};

export type ResumeGeneration = {
  resume: TailoredResume;
  analysis: ResumeAnalysis;
  provider: string;
  model: string;
  tokenUsage: Record<string, unknown> | null;
};

export async function generateTailoredResume(content: SiteContent, input: CreateResumeInput): Promise<ResumeGeneration> {
  const provider = process.env.AI_PROVIDER ?? "grok";

  if (provider !== "grok") {
    return localGeneration(content, input, `Unsupported provider "${provider}"`);
  }

  const apiKey = process.env.XAI_API_KEY;
  const model = process.env.XAI_MODEL ?? "grok-4.3";

  if (!apiKey) {
    return localGeneration(content, input, "XAI_API_KEY is not configured");
  }

  const response = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      stream: false,
      temperature: 0.2,
      messages: buildMessages(content, input)
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Grok resume generation failed (${response.status}): ${detail.slice(0, 500)}`);
  }

  const data = (await response.json()) as ChatResponse;
  const text = data.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error("Grok returned an empty response.");
  }

  const parsed = parseJson(text);
  const baselineResume = createBaselineResume(content, input);
  const baselineAnalysis = createBaselineAnalysis(content, input);

  return {
    resume: {
      ...baselineResume,
      ...parsed.resume,
      profile: baselineResume.profile,
      skills: parsed.resume?.skills?.length ? sanitizeSkillGroups(parsed.resume.skills) : baselineResume.skills,
      experience: parsed.resume?.experience?.length ? mergeExperienceMetadata(baselineResume.experience, parsed.resume.experience) : baselineResume.experience,
      projects: parsed.resume?.projects?.length ? parsed.resume.projects : baselineResume.projects,
      education: parsed.resume?.education?.length ? parsed.resume.education : baselineResume.education,
      keywords: parsed.resume?.keywords?.length ? parsed.resume.keywords : baselineResume.keywords,
      notes: parsed.resume?.notes?.length ? parsed.resume.notes : []
    },
    analysis: {
      ...baselineAnalysis,
      ...parsed.analysis,
      targetRole: input.targetRole,
      company: input.company
    },
    provider: "grok",
    model,
    tokenUsage: data.usage ?? null
  };
}

function localGeneration(content: SiteContent, input: CreateResumeInput, reason: string): ResumeGeneration {
  const resume = createBaselineResume(content, input);

  return {
    resume: {
      ...resume,
      notes: [reason, ...resume.notes]
    },
    analysis: createBaselineAnalysis(content, input),
    provider: "local",
    model: "baseline",
    tokenUsage: null
  };
}

function buildMessages(content: SiteContent, input: CreateResumeInput): ChatMessage[] {
  return [
    {
      role: "system",
      content: [
        "You generate truthful, concise, ATS-friendly software engineering resumes.",
        "Use only the provided candidate evidence. Do not invent employers, metrics, tools, dates, titles, degrees, awards, or public project details.",
        "Tailor emphasis to the job listing by mirroring important keywords only where the candidate evidence supports them.",
        "Write bullets as action + scope/context + result or business relevance. Use numbers only when present in the evidence; otherwise use concrete scope, complexity, risk, or ownership.",
        "Prefer senior engineering language: system design, API design, data modelling, technical direction, product ownership, reliability, integrations, DevOps ownership, stakeholder communication.",
        "Avoid vague filler and resume clichés such as code review culture, passionate, dynamic, ninja, rockstar, responsible for, helped with, worked on, strong communication skills, fast learner, and team player.",
        "Do not label relevant client/product work as academic projects. Treat it as relevant work evidence.",
        "Keep education compact and include it only from candidate evidence. Do not infer missing degrees, schools, or graduation years.",
        "Keep skill groups crisp: 3-5 groups, 4-8 items per group, no full sentences, no culture claims.",
        "Return only valid JSON with this exact top-level shape: {\"analysis\": {...}, \"resume\": {...}}.",
        "No markdown fences. No prose outside JSON."
      ].join(" ")
    },
    {
      role: "user",
      content: JSON.stringify({
        target: {
          company: input.company,
          role: input.targetRole,
          jobListing: input.jobListing,
          resumeConcept: input.concept
        },
        requiredJsonShape: {
          analysis: {
            matchSummary: "2-3 sentences",
            emphasizedEvidence: ["specific evidence from candidate data"],
            keywordTargets: ["keywords from job listing worth reflecting honestly"],
            gapsOrCautions: ["honest cautions, missing evidence, or items to manually review"]
          },
          resume: {
            headline: "one-line target headline",
            summary: "3-4 line professional summary",
            skills: [{ title: "specific capability group, e.g. Backend systems or Architecture and delivery", items: ["concrete skill or capability"] }],
            experience: [{ company: "company", companyUrl: "official company URL if provided", companyContext: "compact company geography/context if provided", role: "role", period: "period", bullets: ["action-led accomplishment or scoped responsibility"] }],
            projects: [{ name: "work example", context: "client, product, or domain", bullets: ["relevant work evidence, written like resume bullets"] }],
            education: [{ school: "school", degree: "degree", period: "period", details: ["optional compact detail"] }],
            keywords: ["ATS keyword"],
            notes: ["private note to Riya about what to review"]
          }
        },
        candidateEvidence: content
      })
    }
  ];
}

function parseJson(text: string): Partial<ResumeGeneration> {
  const trimmed = text.trim();
  const withoutFence = trimmed.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();

  try {
    return JSON.parse(withoutFence) as Partial<ResumeGeneration>;
  } catch {
    const start = withoutFence.indexOf("{");
    const end = withoutFence.lastIndexOf("}");

    if (start === -1 || end === -1 || end <= start) {
      throw new Error("Grok response did not contain parseable JSON.");
    }

    return JSON.parse(withoutFence.slice(start, end + 1)) as Partial<ResumeGeneration>;
  }
}

function sanitizeSkillGroups(skills: TailoredResume["skills"]): TailoredResume["skills"] {
  const replacements = new Map([
    ["Code review culture", "Engineering quality"],
    ["Team mentoring", "Developer mentoring"],
    ["Delivery planning", "Delivery ownership"],
    ["Tradeoff decisions", "Technical tradeoffs"],
    ["Architecture reviews", "Architecture review"]
  ]);

  return skills
    .map((group) => ({
      ...group,
      items: Array.from(
        new Set(
          group.items
            .map((item) => replacements.get(item.trim()) ?? item.trim())
            .filter(Boolean)
        )
      )
    }))
    .filter((group) => group.items.length > 0);
}

function mergeExperienceMetadata(
  baseline: TailoredResume["experience"],
  generated: TailoredResume["experience"]
): TailoredResume["experience"] {
  return generated.map((item) => {
    const match = baseline.find((baselineItem) => baselineItem.company.toLowerCase() === item.company.toLowerCase());

    return {
      ...item,
      companyUrl: item.companyUrl ?? match?.companyUrl,
      companyContext: item.companyContext ?? match?.companyContext
    };
  });
}
