import type { SiteContent } from "./content";
import type { TailoredResume } from "./resume";

export const resumeEdgeChecklist = [
  "Make the first third of the resume answer level, domain, and current value.",
  "Use a simple one-column structure with standard section names.",
  "Put the newest and strongest experience first, with enough context to show seniority.",
  "Write bullets as action, scope, and business or technical relevance.",
  "Use firm verbs such as owned, led, built, shipped, designed, integrated, and managed.",
  "Avoid vague claims unless there is evidence attached to the same line.",
  "Keep skills grouped by capability instead of dumping every tool into one list.",
  "Use exact keywords recruiters search for, but only where the experience supports them.",
  "Keep links clean: email, LinkedIn, GitHub, and a portfolio domain are enough.",
  "Make the PDF text-selectable and avoid graphics, tables, photos, keyword-stuffing sections, and complex layouts."
];

export function getPublicResume(content: SiteContent): TailoredResume {
  const defaultResume = createDefaultPublicResume(content);
  return normalizePublicResume(content.resumeLab.publicResume ?? defaultResume, defaultResume);
}

export const publicResumeHeadline = "Senior Full-Stack / Backend Platform Engineer | AI Products, Payments, DevOps, Technical Leadership";

export const publicResumeSummary =
  "Senior full-stack and backend platform engineer with 8+ years delivering marketplace, payments, EV launch, travel technology, AI SaaS, and startup systems. Built checkout/pricing services for a marketplace that surpassed 50M lifetime trades, shipped 3 AI-first products in 6 months, integrated payment and booking workflows during a 100k+ reservation launch, and now leads zero-to-one architecture, DevOps, AI workflow automation, and engineering delivery as a founding engineer and fractional CTO.";

export const recruiterKeywords = [
  "Senior full-stack engineer",
  "Backend platform engineer",
  "System design",
  "Backend architecture",
  "Product engineering",
  "AI products",
  "AI workflows",
  "LLM integrations",
  "Workflow automation",
  "Technical leadership",
  "Fractional CTO",
  "Founding engineer",
  "Startup engineering",
  "SaaS",
  "Marketplace systems",
  "Ecommerce",
  "Checkout",
  "Payments",
  "Payment integrations",
  "REST APIs",
  "Microservices",
  "Data modeling",
  "Data modelling",
  "PostgreSQL",
  "DynamoDB",
  "Kafka",
  "SQS",
  "AWS",
  "Kubernetes",
  "CI/CD",
  "DevOps",
  "Observability",
  "Datadog",
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "FastAPI",
  "Django",
  "Golang",
  "Java Spring Boot",
  "Firebase",
  "PWA",
  "Local-first RAG",
  "LanceDB",
  "Bhashini ASR",
  "Whisper",
  "OpenAI API",
  "Grok",
  "SVG ingestion",
  "Lottie ingestion",
  "Creator tooling",
  "CSV ingestion",
  "PDF ingestion",
  "Document automation",
  "Report generation",
  "Python",
  "Java",
  "Express",
  "Angular",
  "MongoDB",
  "MySQL",
  "Scylla",
  "Neon",
  "Stripe",
  "Adyen",
  "PayU",
  "CloudFront",
  "Cloud Functions",
  "Firestore",
  "Jenkins",
  "CircleCI",
  "Harness",
  "Marathon",
  "Mesos",
  "n8n"
];

export const publicResumeSkillGroups = [
  {
    title: "Backend, data, and product systems",
    items: [
      "System design",
      "Backend architecture",
      "REST APIs",
      "Microservices",
      "Data modeling",
      "PostgreSQL",
      "DynamoDB",
      "Kafka",
      "SQS",
      "Checkout",
      "Payments",
      "Adyen",
      "PayU",
      "Stripe"
    ]
  },
  {
    title: "AI, data ingestion, and workflow automation",
    items: [
      "AI product workflows",
      "LLM integrations",
      "OpenAI API",
      "Whisper",
      "RAG",
      "SVG and Lottie ingestion",
      "CSV/PDF ingestion",
      "Report generation",
      "Document automation",
      "n8n"
    ]
  },
  {
    title: "Full-stack languages and frameworks",
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "Express",
      "Django",
      "FastAPI",
      "Python",
      "Go",
      "Java Spring Boot"
    ]
  },
  {
    title: "Cloud, DevOps, and technical leadership",
    items: [
      "AWS",
      "Azure",
      "Firebase",
      "Cloud Functions",
      "Kubernetes",
      "Jenkins",
      "CircleCI",
      "Harness",
      "Datadog",
      "Product architecture",
      "DevOps ownership",
      "Fractional CTO",
      "Hiring and interviewing"
    ]
  }
];

export const publicResumeNotableWork = [
  {
    name: "Marketplace scale and checkout reliability",
    context: "StockX | checkout, pricing, marketplace infrastructure",
    bullets: [
      "Built and operated checkout and pricing services for a global marketplace that surpassed 50M lifetime trades, 15M buyers, and 1.7M sellers by 2023, working across Go, Node.js, PostgreSQL, DynamoDB, Kafka, SQS, AWS, Kubernetes, CircleCI, Harness, and Datadog."
    ]
  },
  {
    name: "AI SaaS product shipping",
    context: "Lumentis AI | legal, reporting, enterprise assistants",
    bullets: [
      "Shipped 3 AI-first SaaS and enterprise products in 6 months, covering legal transcription with Whisper, business report generation with AI-generated content/charts/PDF export, and a self-hostable enterprise assistant with open-source LLM support."
    ]
  },
  {
    name: "Startup technical leadership",
    context: "Gryd.io | US startup | architecture and delivery",
    bullets: [
      "Lead architecture and delivery as fractional CTO for a US startup, managing a small part-time engineering team while owning backend architecture, DevOps, Atlassian Marketplace apps, CRM/marketing automation, AI workflow prototyping, and release tradeoffs."
    ]
  },
  {
    name: "EV launch customer systems",
    context: "Ola Electric | EV launch, payments, booking workflows",
    bullets: [
      "Built customer-facing web, payment, and test-ride systems during Ola Electric's launch cycle, including Adyen and PayU integrations for a vehicle launch that reached 100k+ reservations in 24 hours and about 500k first-month bookings."
    ]
  }
];

export function normalizePublicResume(resume: TailoredResume, defaultResume?: TailoredResume): TailoredResume {
  return {
    ...resume,
    headline: shouldUsePublicResumeHeadline(resume.headline) ? publicResumeHeadline : resume.headline,
    summary: shouldUsePublicResumeSummary(resume.summary) ? publicResumeSummary : resume.summary,
    skills: arrayOr(resume.skills, defaultResume?.skills ?? publicResumeSkillGroups),
    experience: arrayOr(resume.experience, defaultResume?.experience ?? []),
    projects: arrayOr(resume.projects, defaultResume?.projects ?? publicResumeNotableWork),
    education: arrayOr(resume.education, defaultResume?.education ?? []),
    keywords: Array.from(new Set(arrayOr(resume.keywords, defaultResume?.keywords ?? recruiterKeywords))),
    notes: arrayOr(resume.notes, defaultResume?.notes ?? [])
  };
}

function shouldUsePublicResumeHeadline(headline: string | undefined) {
  return !headline || headline.includes("Backend Systems, AI Product Workflows");
}

function shouldUsePublicResumeSummary(summary: string | undefined) {
  return !summary || summary.includes("What is mobility") || summary.startsWith("Senior full-stack engineer with 8+ years across marketplace systems, mobility");
}

function arrayOr<T>(value: T[] | undefined, fallback: T[]) {
  return Array.isArray(value) ? value : fallback;
}

export function createDefaultPublicResume(content: SiteContent): TailoredResume {
  return {
    profile: {
      name: content.profile.name,
      title: content.profile.title,
      email: content.profile.email,
      location: content.profile.location || "Remote",
      links: [
        { label: "Portfolio", url: `https://${content.profile.domain}` },
        { label: "LinkedIn", url: content.profile.links.linkedin },
        { label: "GitHub", url: content.profile.links.github }
      ]
    },
    headline: publicResumeHeadline,
    summary: publicResumeSummary,
    skills: publicResumeSkillGroups,
    experience: [
      {
        company: "Stealth startup",
        companyUrl: "",
        companyContext: "Creator tools startup | remote",
        role: "Founding engineer",
        period: "2026 - Present",
        bullets: [
          "Own zero-to-one product engineering for live streamer and creator tooling across architecture, backend systems, frontend workflows, integrations, and release tradeoffs.",
          "Architect an AI-powered widget ingestion platform that converts AI-processed SVG and Lottie assets into reusable creator-facing components, reducing repetitive manual build work for a large widget library.",
          "Translate founder priorities and ambiguous creator workflows into production-ready surfaces for high-pressure live usage."
        ]
      },
      {
        company: "Gryd.io",
        companyUrl: "https://www.gryd.io/",
        companyContext: "US company | remote",
        role: "Fractional CTO",
        period: "Dec 2024 - Present",
        bullets: [
          "Lead architecture and delivery for a US startup, managing a small part-time engineering team across backend architecture, DevOps, Atlassian Marketplace apps, CRM/marketing automation, and production releases.",
          "Build a CRM and automated marketing platform from zero to production, turning founder and client requirements into API design, workflow automation, and release plans for an existing customer base.",
          "Prototype AI and automation workflows for client-facing product needs and internal operations while keeping delivery lightweight and maintainable."
        ]
      },
      {
        company: "Lumentis AI",
        companyUrl: "https://lumentis.ai/",
        companyContext: "German AI company | remote",
        role: "Software developer",
        period: "Apr 2024 - Sep 2024",
        bullets: [
          "Shipped 3 AI-first SaaS and enterprise products in 6 months: legal transcription, business report generation, and a self-hostable enterprise assistant.",
          "Built a subscription transcription workflow for a law firm using context-aware Whisper, Stripe subscriptions, React, Django, and CloudFront.",
          "Delivered enterprise assistant and reporting workflows with open-source LLM support, search, speech input, persistence, sandboxed execution, generated charts, and PDF export."
        ]
      },
      {
        company: "StockX",
        companyUrl: "https://stockx.com/",
        companyContext: "US marketplace | India engineering office",
        role: "Software engineer",
        period: "Jun 2021 - Oct 2023",
        bullets: [
          "Built and operated checkout and pricing microservices for global marketplace systems serving a platform that surpassed 50M lifetime trades, 15M buyers, and 1.7M sellers by 2023.",
          "Owned backend delivery across Go, Node.js, PostgreSQL, DynamoDB, Kafka, SQS, AWS, Kubernetes, CircleCI, Harness, and Datadog for high-traffic, fraud-sensitive commerce workflows.",
          "Improved marketplace domain reliability across checkout business logic, pricing rules, regulatory constraints, peak traffic, scalability, and fraud-risk workflows."
        ]
      },
      {
        company: "Ola Electric",
        companyUrl: "https://www.olaelectric.com/",
        companyContext: "High-scale EV product company",
        role: "Software engineer",
        period: "Nov 2019 - May 2021",
        bullets: [
          "Built customer-facing website, payment, and test-ride systems during Ola Electric's launch cycle, including Adyen and PayU integrations for a vehicle launch that reached 100k+ reservations in 24 hours.",
          "Delivered scheduled and on-demand test-ride workflows using React, Node.js, Java Spring Boot, and MySQL.",
          "Led external contractors, conducted 50+ interviews, mentored new joiners, and managed service deployments through Jenkins, Marathon, Mesos, and Azure."
        ]
      },
      {
        company: "Amadeus Labs",
        companyUrl: "https://amadeus.com/",
        companyContext: "European travel technology company | India engineering office",
        role: "Software developer",
        period: "Nov 2017 - Oct 2019",
        bullets: [
          "Developed enterprise scheduling and software-load activation tools for travel technology operations across MEAN-stack workflows and Java-backed internal systems.",
          "Supported production-change workflows used by internal engineering and operations teams in a large travel technology environment."
        ]
      }
    ],
    projects: publicResumeNotableWork,
    education: content.education,
    keywords: recruiterKeywords,
    notes: []
  };
}
