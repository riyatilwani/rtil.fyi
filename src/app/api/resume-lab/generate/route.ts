import { NextResponse, type NextRequest } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { getSiteContent } from "@/lib/content";
import { generateTailoredResume } from "@/lib/resume-ai";
import { isResumeConcept, type CreateResumeInput, type ResumeDraft } from "@/lib/resume";
import { createResumeDraft } from "@/lib/resume-store";

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<CreateResumeInput>;
    const input = validateInput(body);
    const content = await getSiteContent();
    const generation = await generateTailoredResume(content, input);
    const now = new Date().toISOString();
    const draft: ResumeDraft = {
      id: crypto.randomUUID(),
      title: [input.company, input.targetRole].filter(Boolean).join(" | ") || "Tailored resume draft",
      company: input.company,
      targetRole: input.targetRole,
      jobListing: input.jobListing,
      concept: input.concept,
      resume: generation.resume,
      analysis: generation.analysis,
      provider: generation.provider,
      model: generation.model,
      tokenUsage: generation.tokenUsage,
      createdAt: now,
      updatedAt: now
    };

    const saved = await createResumeDraft(draft);
    return NextResponse.json({ draft: saved });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to generate resume" }, { status: 500 });
  }
}

function validateInput(body: Partial<CreateResumeInput>): CreateResumeInput {
  const targetRole = body.targetRole?.trim() ?? "";
  const company = body.company?.trim() ?? "";
  const jobListing = body.jobListing?.trim() ?? "";
  const concept = isResumeConcept(body.concept) ? body.concept : "classic";

  if (targetRole.length < 2) {
    throw new Error("Add a target role before generating.");
  }

  if (jobListing.length < 80) {
    throw new Error("Paste a fuller job listing before generating. Short snippets produce weak tailoring.");
  }

  return {
    company: company || "Target company",
    targetRole,
    jobListing,
    concept
  };
}
