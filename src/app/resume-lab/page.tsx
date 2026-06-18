import Link from "next/link";
import { FileText, Settings, Sparkles } from "lucide-react";
import { adminSessionToken } from "@/lib/auth";
import { getSiteContent } from "@/lib/content";
import { resumeConcepts } from "@/lib/resume";
import { listResumeDrafts } from "@/lib/resume-store";
import { ResumeLabClient } from "./resume-lab-client";

export const dynamic = "force-dynamic";

export default async function ResumeLab() {
  const content = await getSiteContent();
  const adminToken = adminSessionToken();
  const initialDrafts = await listResumeDrafts();

  return (
    <main className="resume-lab-shell">
      <header className="top-nav lab-top-nav">
        <Link className="brand" href="/">
          <span className="brand-mark">RT</span>
          <span>Resume Lab</span>
        </Link>
        <nav className="nav-links" aria-label="Private navigation">
          <Link href="/admin">
            <Settings size={14} aria-hidden /> Admin
          </Link>
          <Link href="/">
            <FileText size={14} aria-hidden /> Public site
          </Link>
        </nav>
      </header>

      <section className="lab-hero">
        <div>
          <span className="section-label">Private workspace</span>
          <h1>Tailor a clean resume from a job post.</h1>
          <p>
            Paste a listing, choose a resume concept, generate with Grok, edit the structured sections, save the draft,
            then open a print-ready PDF view.
          </p>
        </div>
        <aside className="lab-principles" aria-label="Resume principles">
          {content.resumeLab.principles.map((principle) => (
            <span key={principle}>
              <Sparkles size={15} aria-hidden />
              {principle}
            </span>
          ))}
        </aside>
      </section>

      <ResumeLabClient adminToken={adminToken} concepts={resumeConcepts} initialDrafts={initialDrafts} />
    </main>
  );
}
