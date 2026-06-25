import path from "node:path";
import PDFDocument from "pdfkit";
import { getSiteContent } from "@/lib/content";
import { getPublicResume } from "@/lib/public-resume";
import type { ResumeConcept, TailoredResume } from "@/lib/resume";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const page = {
  width: 595.28,
  height: 841.89,
  margin: 42
};
const resumeFontPath = path.join(process.cwd(), "public", "geist-resume.ttf");
const fontName = "ResumeRegular";

export async function GET() {
  const content = await getSiteContent();
  const resume = getPublicResume(content);
  const buffer = await renderResumePdf(resume, getTheme(content.resumeLab.publicResumeConcept));

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="riya-tilwani-resume.pdf"',
      "Cache-Control": "no-store"
    }
  });
}

type PdfTheme = {
  accent: string;
  rule: string;
  muted: string;
  nameSize: number;
};

async function renderResumePdf(resume: TailoredResume, theme: PdfTheme) {
  const doc = new PDFDocument({
    size: "A4",
    font: resumeFontPath,
    margins: {
      top: page.margin,
      right: page.margin,
      bottom: page.margin,
      left: page.margin
    },
    info: {
      Title: `${resume.profile.name} Resume`,
      Author: resume.profile.name,
      Subject: resume.headline
    }
  });

  const chunks: Buffer[] = [];
  const done = new Promise<Buffer>((resolve, reject) => {
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });
  doc.registerFont(fontName, resumeFontPath);

  writeHeader(doc, resume, theme);
  writeSection(doc, "Summary", theme);
  paragraph(doc, resume.summary);

  writeSection(doc, "Technical Skills", theme);
  resume.skills.forEach((group) => {
    paragraph(doc, `${group.title}: ${group.items.join(", ")}`, { boldPrefix: `${group.title}:` });
  });

  writeSection(doc, "Professional Experience", theme);
  resume.experience.forEach((item) => {
    entryHead(doc, item.company, item.period, item.companyUrl);
    muted(doc, [item.role, item.companyContext].filter(Boolean).join(" | "));
    bullets(doc, item.bullets);
  });

  if (resume.projects.length) {
    writeSection(doc, "Notable Work", theme);
    resume.projects.forEach((item) => {
      projectEntryHead(doc, item.name, item.context);
      bullets(doc, item.bullets);
    });
  }

  if (resume.education.length) {
    writeSection(doc, "Education", theme);
    resume.education.forEach((item) => {
      entryHead(doc, item.school, item.period);
      paragraph(doc, item.degree);
      if (item.details.length) {
        paragraph(doc, item.details.join(", "));
      }
    });
  }

  doc.end();
  return done;
}

function getTheme(concept: ResumeConcept | undefined): PdfTheme {
  if (concept === "technical") {
    return { accent: "#1f5d8f", rule: "#c8dce1", muted: "#456066", nameSize: 19 };
  }

  if (concept === "compact") {
    return { accent: "#5f6f3a", rule: "#d4d8c6", muted: "#52574c", nameSize: 18 };
  }

  return { accent: "#7a4a2b", rule: "#d8d3c9", muted: "#555555", nameSize: 20 };
}

function writeHeader(doc: PDFKit.PDFDocument, resume: TailoredResume, theme: PdfTheme) {
  doc.font(fontName).fontSize(theme.nameSize).fillColor("#111111").text(resume.profile.name, page.margin, doc.y, { lineGap: 2 });
  doc.font(fontName).fontSize(10.5).fillColor("#222222").text(resume.headline, page.margin, doc.y, { lineGap: 4 });
  doc
    .fontSize(9.5)
    .fillColor("#333333")
    .text(
      [
        resume.profile.email,
        resume.profile.location,
        ...resume.profile.links.map((link) => `${link.label}: ${link.url}`)
      ].join(" | "),
      page.margin,
      doc.y,
      { lineGap: 2 }
    );
  doc.moveDown(0.8);
}

function writeSection(doc: PDFKit.PDFDocument, title: string, theme: PdfTheme) {
  ensureRoom(doc, 44);
  doc.moveDown(0.35);
  doc
    .font(fontName)
    .fontSize(9.5)
    .fillColor(theme.accent)
    .text(title.toUpperCase(), page.margin, doc.y, { characterSpacing: 0.8 });
  doc
    .moveTo(page.margin, doc.y + 3)
    .lineTo(page.width - page.margin, doc.y + 3)
    .strokeColor(theme.rule)
    .lineWidth(0.7)
    .stroke();
  doc.moveDown(0.55);
}

function entryHead(doc: PDFKit.PDFDocument, title: string, meta: string, link?: string) {
  ensureRoom(doc, 36);
  const y = doc.y;
  doc.font(fontName).fontSize(10.5).fillColor("#111111");

  if (link) {
    doc.text(title, page.margin, y, { width: 330, link });
  } else {
    doc.text(title, page.margin, y, { width: 330 });
  }

  doc.font(fontName).fontSize(9.5).fillColor("#444444").text(meta, page.margin + 338, y, {
    align: "right",
    width: page.width - page.margin * 2 - 338
  });
  doc.y = Math.max(doc.y, y + 15);
  doc.x = page.margin;
}

function projectEntryHead(doc: PDFKit.PDFDocument, title: string, meta: string) {
  ensureRoom(doc, 42);
  doc.font(fontName).fontSize(10.5).fillColor("#111111").text(title, page.margin, doc.y, {
    width: page.width - page.margin * 2,
    lineGap: 1.2
  });
  doc.font(fontName).fontSize(9.1).fillColor("#555555").text(meta, page.margin, doc.y, {
    width: page.width - page.margin * 2,
    lineGap: 1
  });
  doc.moveDown(0.2);
}

function bullets(doc: PDFKit.PDFDocument, items: string[]) {
  items.forEach((item) => {
    ensureRoom(doc, 24);
    const y = doc.y;
    doc.font(fontName).fontSize(9.3).fillColor("#151515").text("-", page.margin + 8, y, { width: 8 });
    doc.text(item, page.margin + 20, y, {
      width: page.width - page.margin * 2 - 20,
      lineGap: 1.8
    });
    doc.moveDown(0.25);
  });
  doc.moveDown(0.25);
}

function paragraph(doc: PDFKit.PDFDocument, text: string, options: { boldPrefix?: string } = {}) {
  ensureRoom(doc, 28);

  if (options.boldPrefix && text.startsWith(options.boldPrefix)) {
    doc.font(fontName).fontSize(9.4).fillColor("#111111").text(options.boldPrefix, page.margin, doc.y, {
      continued: true
    });
    doc.font(fontName).text(text.slice(options.boldPrefix.length), {
      width: page.width - page.margin * 2,
      lineGap: 1.8
    });
  } else {
    doc.font(fontName).fontSize(9.4).fillColor("#151515").text(text, page.margin, doc.y, {
      width: page.width - page.margin * 2,
      lineGap: 1.8
    });
  }

  doc.moveDown(0.35);
}

function muted(doc: PDFKit.PDFDocument, text: string) {
  if (!text) {
    return;
  }

  doc.font(fontName).fontSize(9.3).fillColor("#555555").text(text, page.margin, doc.y, {
    width: page.width - page.margin * 2,
    lineGap: 1.5
  });
  doc.moveDown(0.25);
}

function small(doc: PDFKit.PDFDocument, text: string) {
  doc.font(fontName).fontSize(8.6).fillColor("#333333").text(text, page.margin, doc.y, {
    width: page.width - page.margin * 2,
    lineGap: 1.5
  });
}

function ensureRoom(doc: PDFKit.PDFDocument, points: number) {
  if (doc.y + points > page.height - page.margin) {
    doc.addPage();
  }
}
