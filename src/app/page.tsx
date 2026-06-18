import {
  ArrowUpRight,
  Bot,
  Briefcase,
  CalendarCheck,
  CheckCircle2,
  Database,
  FileText,
  FolderGit2,
  GitBranch,
  Mail,
  MessageSquare,
  Mic,
  Route,
  Send,
  Table2,
  Target,
  Wrench
} from "lucide-react";
import { getSiteContent } from "@/lib/content";

const serviceIcons = [Bot, Database, GitBranch] as const;
const positioningIcons = [Briefcase, Bot, Database, Route] as const;
const caseIcons = [MessageSquare, FileText, Mic, Table2] as const;

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getSiteContent();

  return (
    <main className={`site-shell concept-${content.concept}`}>
      <Header />

      <section className="hero">
        <div className="hero-grid">
          <div>
            <h1>{content.profile.name}</h1>
            <p className="hero-summary">{content.profile.summary}</p>
            <div className="positioning-grid" aria-label="Core strengths">
              {content.positioning.map((item, index) => {
                const Icon = positioningIcons[index % positioningIcons.length];

                return (
                  <span key={item}>
                    <Icon size={16} aria-hidden />
                    {item}
                  </span>
                );
              })}
            </div>
            <div className="company-strip" aria-label="Companies">
              {content.credibility.map((company) => (
                <span key={company}>{company}</span>
              ))}
            </div>
            <div className="hero-actions">
              <a className="button" href={`mailto:${content.profile.email}`}>
                <Mail size={16} aria-hidden /> Get in touch
              </a>
              <a className="button secondary" href="/resume.pdf" download>
                <FileText size={16} aria-hidden /> Download resume
              </a>
            </div>
          </div>

          <aside className="proof-panel" aria-label="Profile summary">
            <div className="proof-row">
              <span>
                <Target size={14} aria-hidden /> Focus
              </span>
              <strong>{content.profile.title}</strong>
            </div>
            <div className="proof-row">
              <span>
                <Route size={14} aria-hidden /> Track
              </span>
              <strong>{content.profile.years} across marketplaces, mobility, travel tech, AI products, and startup systems.</strong>
            </div>
            <div className="proof-row">
              <span>
                <CalendarCheck size={14} aria-hidden /> Available
              </span>
              <strong>{content.profile.availability}</strong>
            </div>
          </aside>
        </div>
      </section>

      <section className="section" id="services">
        <SectionHead
          label="How I can help"
          title="Senior engineering for teams that need product judgment and hands-on delivery."
          intro="I’m useful when the work crosses backend systems, product constraints, AI workflows, integrations, and the messy decisions that sit between idea and shipped software."
        />
        <div className="service-grid">
          {content.services.map((service, index) => {
            const Icon = serviceIcons[index % serviceIcons.length];

            return (
              <article className="service" key={service.title}>
                <Icon className="service-icon" size={22} aria-hidden />
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <small>{service.proof}</small>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section" id="experience">
        <SectionHead
          label="Experience"
          title="A full-time foundation across marketplaces, mobility, travel tech, AI products, and startups."
          intro="A chronological view of the roles behind the work: global marketplace systems, payments, travel technology, fractional leadership, and recent AI/product builds."
        />
        <div className="experience-list">
          {content.experience.map((item) => (
            <div className="experience-row" key={`${item.company}-${item.role}`}>
              <strong>
                <Briefcase size={17} aria-hidden />
                <span>
                  {item.companyUrl ? <a href={item.companyUrl}>{item.company}</a> : item.company}
                  <br />
                  <em>{item.role}</em>
                  {item.companyContext ? (
                    <>
                      <br />
                      <small>{item.companyContext}</small>
                    </>
                  ) : null}
                </span>
              </strong>
              <div>
                <p>
                  <b>{item.period}</b> · {item.context}
                  {item.location ? <> · {item.location}</> : null}
                </p>
                <p>{item.description}</p>
                <ul className="experience-highlights">
                  {item.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
                <div className="stack compact-stack">
                  {item.stack.map((stackItem) => (
                    <span key={stackItem}>{stackItem}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="work">
        <SectionHead
          label="Notable work"
          title="Representative product and systems problems I have owned."
          intro="A few deeper examples that show the kind of systems, product ambiguity, platform thinking, and AI workflows I can own beyond a role title."
        />
        <div className="case-list">
          {content.projects.map((project, index) => {
            const Icon = caseIcons[index % caseIcons.length];

            return (
              <article className="case-row" key={`${project.client}-${project.name}`}>
                <div className="case-meta">
                  <span>
                    <small>Case</small>
                    {project.client}
                  </span>
                  <span>
                    <small>Role</small>
                    {project.role}
                  </span>
                  <span>
                    <small>Area</small>
                    {project.theme}
                  </span>
                </div>
                <div>
                  <div className="case-title-row">
                    <span className="case-icon">
                      <Icon size={18} aria-hidden />
                    </span>
                    <h3>{project.name}</h3>
                  </div>
                  <p>{project.summary}</p>
                  <p>{project.challenge}</p>
                  <p>{project.outcome}</p>
                  <div className="stack">
                    {project.stack.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section">
        <SectionHead
          label="Client feedback"
          title="Trusted to own the work across product, code, and execution."
          intro="A few client notes that reflect the working style: direct ownership, full-stack range, and steady delivery."
        />
        <div className="testimonial-grid">
          {content.testimonials.map((testimonial) => (
            <figure key={testimonial.author}>
              <blockquote>{testimonial.quote}</blockquote>
              <figcaption>
                {testimonial.author} | {testimonial.role} | {testimonial.date}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="section" id="lab">
        <SectionHead
          label="Public GitHub"
          title="A growing set of experiments and reusable engineering pieces."
          intro="I’m adding more public work over time, especially around AI-native development, agent workflows, and full-stack foundations."
        />
        <div className="lab-list">
          {content.github.map((repo) => (
            <a className="lab-row" href={repo.url} key={repo.name}>
              <strong>
                <FolderGit2 size={17} aria-hidden />
                {repo.name} <ArrowUpRight size={14} aria-hidden />
              </strong>
              <p>
                {repo.description} {repo.stack.join(" / ")}
              </p>
            </a>
          ))}
        </div>
      </section>

      <section className="section" id="contact">
        <SectionHead
          label="Work with me"
          title="Best fit for startups and lean teams that need senior momentum."
          intro="I’m most useful when the scope is technical, ambiguous, and important enough to need an engineer who can reason through tradeoffs and still ship."
        />
        <div className="contact-panel">
          <div>
            <h3>Good fit</h3>
            <ul className="contact-options">
              {content.openTo.map((item) => (
                <li key={item}>
                  <CheckCircle2 size={16} aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="contact-card">
            <Mail size={22} aria-hidden />
            <strong>Email me directly</strong>
            <a href={`mailto:${content.profile.email}`}>{content.profile.email}</a>
            <p>
              <a href={content.profile.links.linkedin}>LinkedIn</a> ·{" "}
              <a href={content.profile.links.github}>GitHub</a> ·{" "}
              <a href={content.profile.links.upwork}>Upwork</a>
            </p>
          </div>
        </div>
      </section>

      <footer className="footer">
        {content.profile.domain} · Full-stack, backend, AI systems, and startup execution.
      </footer>
    </main>
  );
}

function Header() {
  return (
    <header className="top-nav">
      <a className="brand" href="/">
        <span className="brand-mark">RT</span>
        <span>rtil.fyi</span>
      </a>
      <nav className="nav-links" aria-label="Primary navigation">
        <a href="#experience">
          <Briefcase size={14} aria-hidden /> Experience
        </a>
        <a href="#work">
          <FolderGit2 size={14} aria-hidden /> Work
        </a>
        <a href="#services">
          <Wrench size={14} aria-hidden /> Services
        </a>
        <a href="#contact">
          <Send size={14} aria-hidden /> Contact
        </a>
      </nav>
    </header>
  );
}

function SectionHead({
  label,
  title,
  intro
}: {
  label: string;
  title: string;
  intro: string;
}) {
  return (
    <div className="section-head">
      <span className="section-label">{label}</span>
      <div>
        <h2>{title}</h2>
        <p className="section-intro">{intro}</p>
      </div>
    </div>
  );
}
