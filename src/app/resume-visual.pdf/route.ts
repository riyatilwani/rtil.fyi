import path from "node:path";
import { existsSync } from "node:fs";
import PDFDocument from "pdfkit";
import { getSiteContent } from "@/lib/content";
import { getPublicResume } from "@/lib/public-resume";
import type { TailoredResume } from "@/lib/resume";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const page = {
  width: 595.28,
  height: 841.89,
  margin: 36
};
const fontPath = path.join(process.cwd(), "public", "geist-resume.ttf");
const photoPath = path.join(process.cwd(), "public", "profile-photo.png");
const fontName = "ResumeRegular";
const colors = {
  ink: "#293436",
  muted: "#5b6667",
  quiet: "#dbe1df",
  soft: "#eef2f0",
  accent: "#0f6658",
  paleAccent: "#dce8e4",
  paper: "#ffffff"
};

export async function GET() {
  const content = await getSiteContent();
  const resume = getPublicResume(content);
  const buffer = await renderVisualResumePdf(resume);

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="riya-tilwani-visual-resume.pdf"',
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      "Pragma": "no-cache",
      "Expires": "0"
    }
  });
}

async function renderVisualResumePdf(resume: TailoredResume) {
  const doc = new PDFDocument({
    size: "A4",
    font: fontPath,
    margins: {
      top: page.margin,
      right: page.margin,
      bottom: page.margin,
      left: page.margin
    },
    info: {
      Title: `${resume.profile.name} Visual Resume`,
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
  doc.registerFont(fontName, fontPath);

  writeFirstPage(doc, resume);
  doc.addPage();
  writeSecondPage(doc, resume);

  doc.end();
  return done;
}

function writeFirstPage(doc: PDFKit.PDFDocument, resume: TailoredResume) {
  const sidebarX = page.margin;
  const sidebarW = 166;
  const mainX = 230;
  const mainW = page.width - mainX - page.margin;

  drawSoftShapes(doc);
  drawPhoto(doc, sidebarX + 30, 52, 120);
  drawHeader(doc, resume, mainX, 48, mainW);

  let y = 210;
  y = drawSectionTitle(doc, "Experience", mainX, y, mainW);
  resume.experience.slice(0, 4).forEach((item) => {
    y = drawExperienceItem(doc, item.company, item.role, item.period, [item.companyContext, ...item.bullets.slice(0, 2)].filter(isPresentString), mainX, y, mainW);
  });

  let sidebarY = 220;
  sidebarY = drawSidebarSection(doc, "Contact", sidebarX, sidebarY, sidebarW, [
    resume.profile.email,
    resume.profile.location,
    ...resume.profile.links.filter((link) => link.label !== "Portfolio").map((link) => link.url)
  ]);
  sidebarY = drawSidebarSection(doc, "Summary", sidebarX, sidebarY + 14, sidebarW, sidebarSummary(resume));
  drawSidebarSection(doc, "Core Skills", sidebarX, sidebarY + 14, sidebarW, sidebarSkills(resume));
}

function writeSecondPage(doc: PDFKit.PDFDocument, resume: TailoredResume) {
  const mainX = page.margin;
  const mainW = page.width - page.margin * 2;
  let y = 48;

  doc.font(fontName).fontSize(13).fillColor(colors.ink).text(resume.profile.name, mainX, y, {
    width: mainW
  });
  doc.fontSize(8.8).fillColor(colors.muted).text(resume.headline, mainX, y + 20, { width: mainW });
  y += 54;

  y = drawSectionTitle(doc, "Additional Experience", mainX, y, mainW);
  resume.experience.slice(4).forEach((item) => {
    y = drawExperienceItem(doc, item.company, item.role, item.period, [item.companyContext, ...item.bullets.slice(0, 2)].filter(isPresentString), mainX, y, mainW);
  });

  y += 4;
  y = drawSectionTitle(doc, "Selected Achievements", mainX, y, mainW);
  resume.projects.slice(0, 4).forEach((project) => {
    y = drawExperienceItem(doc, project.name, project.context, "", project.bullets.slice(0, 2), mainX, y, mainW);
  });

  y += 4;
  y = drawSectionTitle(doc, "Extended Technical Stack", mainX, y, mainW);
  resume.skills.slice(3).forEach((group) => {
    y = drawCompactLine(doc, group.title, group.items.join(", "), mainX, y, mainW);
  });

}

function drawHeader(doc: PDFKit.PDFDocument, resume: TailoredResume, x: number, y: number, width: number) {
  doc.font(fontName).fontSize(24).fillColor(colors.ink).text(resume.profile.name, x, y, {
    width
  });
  doc.roundedRect(x, y + 54, width, 58, 12).fill(colors.paleAccent);
  doc
    .fontSize(11.5)
    .fillColor(colors.ink)
    .text("FULL-STACK ENGINEERING | BACKEND PLATFORMS | AI PRODUCTS | DEVOPS", x + 16, y + 72, {
      characterSpacing: 1.7,
      lineGap: 4,
      width: width - 32
    });
}

function sidebarSummary(resume: TailoredResume) {
  return resume.summary
    .split(". ")
    .slice(0, 1)
    .map((sentence) => (sentence.endsWith(".") ? sentence : `${sentence}.`));
}

function sidebarSkills(resume: TailoredResume) {
  return resume.skills.slice(0, 4).map((group) => `${group.title}: ${group.items.slice(0, 5).join(", ")}`);
}

function drawSoftShapes(doc: PDFKit.PDFDocument) {
  doc.save();
  doc.fillOpacity(0.72);
  doc.roundedRect(56, 56, 96, 162, 36).rotate(8, { origin: [104, 137] }).fill(colors.soft);
  doc.fillOpacity(0.58);
  doc.circle(60, 150, 32).fill(colors.paleAccent);
  doc.circle(95, 205, 22).fill(colors.paleAccent);
  doc.restore();
}

function drawPhoto(doc: PDFKit.PDFDocument, x: number, y: number, size: number) {
  doc.save();
  doc.circle(x + size / 2, y + size / 2, size / 2).fill(colors.quiet);
  if (existsSync(photoPath)) {
    doc.circle(x + size / 2, y + size / 2, size / 2).clip();
    doc.image(photoPath, x, y, { width: size, height: size });
  } else {
    doc.fillColor(colors.accent).font(fontName).fontSize(32).text("RT", x, y + 40, { width: size, align: "center" });
  }
  doc.restore();
}

function drawSidebarSection(doc: PDFKit.PDFDocument, title: string, x: number, y: number, width: number, lines: string[]) {
  drawIconLabel(doc, title, x, y);
  y += 34;
  doc.font(fontName).fontSize(8.3).fillColor(colors.ink);
  lines.forEach((line) => {
    doc.text(line, x, y, {
      width,
      lineGap: 3
    });
    y = doc.y + 8;
  });
  return y;
}

function drawIconLabel(doc: PDFKit.PDFDocument, title: string, x: number, y: number) {
  doc.roundedRect(x, y - 3, 18, 18, 5).fill(colors.soft);
  doc.circle(x + 9, y + 5.5, 4.5).fill(colors.accent);
  doc.font(fontName).fontSize(12).fillColor(colors.accent).text(title.toUpperCase(), x + 26, y, {
    characterSpacing: 0.4
  });
}

function drawSectionTitle(doc: PDFKit.PDFDocument, title: string, x: number, y: number, width: number) {
  drawIconLabel(doc, title, x, y);
  doc.moveTo(x, y + 26).lineTo(x + width, y + 26).strokeColor(colors.paleAccent).lineWidth(0.8).stroke();
  return y + 42;
}

function drawExperienceItem(doc: PDFKit.PDFDocument, title: string, role: string, period: string, bullets: string[], x: number, y: number, width: number) {
  if (y > page.height - 110) {
    doc.addPage();
    y = page.margin;
  }
  doc.font(fontName).fontSize(10.2).fillColor(colors.ink).text(title, x, y, { width: width * 0.62 });
  if (period) {
    doc.fontSize(9.2).fillColor(colors.muted).text(period, x + width * 0.64, y, {
      width: width * 0.36,
      align: "right"
    });
  }
  y = Math.max(doc.y, y + 14);
  if (role) {
    doc.fontSize(9.3).fillColor(colors.muted).text(role, x, y, { width });
    y = doc.y + 4;
  }
  bullets.forEach((bullet) => {
    doc.fontSize(8.7).fillColor(colors.ink).text("-", x + 4, y, { width: 8 });
    doc.text(bullet, x + 18, y, {
      width: width - 18,
      lineGap: 2
    });
    y = doc.y + 4;
  });
  return y + 8;
}

function drawCompactLine(doc: PDFKit.PDFDocument, label: string, value: string, x: number, y: number, width: number) {
  if (y > page.height - 70) {
    doc.addPage();
    y = page.margin;
  }
  doc.font(fontName).fontSize(8.8).fillColor(colors.ink).text(`${label}: `, x, y, { continued: true });
  doc.fontSize(8.8).fillColor(colors.muted).text(value, {
    width,
    lineGap: 1.6
  });
  return doc.y + 7;
}

function isPresentString(value: string | undefined): value is string {
  return Boolean(value);
}
