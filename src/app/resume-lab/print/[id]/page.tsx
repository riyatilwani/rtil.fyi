import { notFound } from "next/navigation";
import { getResumeDraft } from "@/lib/resume-store";
import { PrintToolbar } from "./print-toolbar";

export default async function PrintableResumePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const draft = await getResumeDraft(id);

  if (!draft) {
    notFound();
  }

  const resume = draft.resume;
  const contactLinks = resume.profile.links.filter((link) => link.label.toLowerCase() !== "upwork");

  return (
    <main className={`print-page resume-${draft.concept}`}>
      <PrintToolbar />
      <article className="resume-sheet">
        <header className="resume-header">
          <div>
            <h1>{resume.profile.name}</h1>
            <p>{resume.headline}</p>
          </div>
          <address>
            <a href={`mailto:${resume.profile.email}`}>{resume.profile.email}</a>
            <span>{resume.profile.location}</span>
            {contactLinks.map((link) => (
              <a href={link.url} key={link.label}>
                {link.label}
              </a>
            ))}
          </address>
        </header>

        <section className="resume-section">
          <h2>Summary</h2>
          <div className="resume-section-body">
            <p>{resume.summary}</p>
          </div>
        </section>

        <section className="resume-section resume-skills">
          <h2>Skills</h2>
          <div className="resume-section-body">
            {resume.skills.map((group) => (
              <p key={group.title}>
                <strong>{group.title}:</strong> {group.items.join(", ")}
              </p>
            ))}
          </div>
        </section>

        <section className="resume-section">
          <h2>Experience</h2>
          <div className="resume-section-body">
            {resume.experience.map((item) => (
              <div className="resume-entry" key={`${item.company}-${item.role}`}>
                <div className="resume-entry-head">
                  <div>
                    <h3>
                      {item.companyUrl ? <a href={item.companyUrl}>{item.company}</a> : item.company}
                    </h3>
                    {item.companyContext ? <small className="resume-company-context">{item.companyContext}</small> : null}
                  </div>
                  <span>{displayExperiencePeriod(item.company, item.period)}</span>
                </div>
                <p>{item.role}</p>
                <ul>
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="resume-section">
          <h2>Relevant Work</h2>
          <div className="resume-section-body">
            {resume.projects.map((project) => (
              <div className="resume-entry" key={project.name}>
                <div className="resume-entry-head">
                  <h3>{project.name}</h3>
                  <span>{project.context}</span>
                </div>
                <ul>
                  {project.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {resume.education?.length ? (
          <section className="resume-section">
            <h2>Education</h2>
            <div className="resume-section-body">
              {resume.education.map((item) => (
                <div className="resume-entry" key={`${item.school}-${item.degree}`}>
                  <div className="resume-entry-head">
                    <h3>{item.school}</h3>
                    <span>{item.period}</span>
                  </div>
                  <p>{item.degree}</p>
                  {item.details.length ? (
                    <ul>
                      {item.details.map((detail) => (
                        <li key={detail}>{detail}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="resume-section resume-keywords">
          <h2>Keywords</h2>
          <div className="resume-section-body">
            <p>{resume.keywords.join(" · ")}</p>
          </div>
        </section>
      </article>
    </main>
  );
}

function displayExperiencePeriod(company: string, period: string) {
  if (company.toLowerCase().includes("stealth") && period.toLowerCase() === "current") {
    return "2026 - Present";
  }

  return period;
}
