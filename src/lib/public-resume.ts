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
  "Senior full-stack and backend platform engineer with 8+ years building marketplace systems, ecommerce checkout and payments, EV customer platforms, travel technology, AI SaaS, and startup products. Owns ambiguous backend-heavy work end to end: system design, REST APIs, microservices, data modeling, integrations, cloud deployments, DevOps, observability, and production delivery. Currently a founding engineer building an AI-powered creator tooling platform for SVG and Lottie widget ingestion, and a fractional CTO leading product architecture, developer execution, AI workflow automation, and release ownership for startup teams.";

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
      "MySQL",
      "DynamoDB",
      "MongoDB",
      "Scylla",
      "Kafka",
      "SQS",
      "Checkout",
      "Payments",
      "Stripe",
      "Adyen",
      "PayU",
      "Subscriptions"
    ]
  },
  {
    title: "AI, data ingestion, and workflow automation",
    items: [
      "AI product workflows",
      "LLM integrations",
      "OpenAI API",
      "Grok",
      "Whisper",
      "Bhashini ASR",
      "Local-first RAG",
      "LanceDB",
      "Local embeddings",
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
      "Vite",
      "TypeScript",
      "JavaScript",
      "Node.js",
      "Express",
      "Django",
      "FastAPI",
      "Python",
      "Golang",
      "Java",
      "Java Spring Boot",
      "Angular"
    ]
  },
  {
    title: "Cloud, DevOps, and technical leadership",
    items: [
      "AWS",
      "CloudFront",
      "Azure",
      "Firebase",
      "Firestore",
      "Cloud Functions",
      "Kubernetes",
      "Jenkins",
      "CircleCI",
      "Harness",
      "Datadog",
      "Marathon",
      "Mesos",
      "Neon",
      "Founding engineering",
      "Fractional CTO",
      "Product architecture",
      "DevOps ownership",
      "Developer management",
      "Hiring and interviewing",
      "Architecture reviews",
      "Delivery ownership",
      "Stakeholder tradeoffs"
    ]
  }
];

export const publicResumeNotableWork = [
  {
    name: "StockX global marketplace backend systems",
    context: "StockX | checkout, pricing, marketplace infrastructure",
    bullets: [
      "Built and operated checkout and pricing microservices for StockX's global marketplace, contributing to backend systems behind a platform that surpassed 50M+ lifetime trades, 15M+ buyers, and 1.7M sellers by 2023.",
      "Worked across Go, Node.js, PostgreSQL, DynamoDB, Kafka, SQS, AWS, Kubernetes, CircleCI, Harness, and Datadog in a high-traffic marketplace environment with regulatory, fraud-risk, and peak-load constraints."
    ]
  },
  {
    name: "AI-first SaaS and enterprise products",
    context: "Lumentis AI | legal, reporting, enterprise assistants",
    bullets: [
      "Shipped 3 AI-first SaaS and enterprise products in 6 months: legal transcription with Whisper, business report generation with AI-generated content, charts, and PDF export, and a self-hostable enterprise assistant.",
      "Delivered product workflows involving open-source LLM support, search, speech input, persistence, sandboxed execution, Stripe subscriptions, React, Django, and CloudFront."
    ]
  },
  {
    name: "Fractional CTO and startup product architecture",
    context: "Gryd.io | US startup | architecture and delivery",
    bullets: [
      "Lead architecture and delivery as Fractional CTO for a US startup, managing a small part-time engineering team while owning backend architecture, DevOps, Atlassian Marketplace apps, CRM and marketing automation, AI workflow prototyping, and production release tradeoffs.",
      "Balance hands-on engineering with product architecture, developer execution, operational decisions, and stakeholder tradeoffs across fast-moving startup builds."
    ]
  },
  {
    name: "Ola Electric launch-period customer systems",
    context: "Ola Electric | EV launch, payments, booking workflows",
    bullets: [
      "Built customer-facing web and backend systems during Ola Electric's high-demand EV launch period, including official website work, Adyen and PayU payments, and scheduled/on-demand test-ride workflows.",
      "Contributed during a launch cycle that saw 100k+ bookings in 24 hours and about 500k first-month bookings, while working across React, Node.js, Java Spring Boot, MySQL, Jenkins, Marathon, Mesos, and Azure."
    ]
  },
  {
    name: "Personal AI and product systems",
    context: "Ledger Lens, India Stock Discovery Agent, Satsang Lekhan",
    bullets: [
      "Built personal AI/product systems demonstrating privacy-first retrieval, deterministic guardrails, local embeddings, ASR pipelines, and full-stack product delivery.",
      "Created Ledger Lens for local-first finance explanation, India Stock Discovery Agent for research workflows with suitability guardrails, and Satsang Lekhan for Hindi long-form speech-to-text with Bhashini ASR and Firebase."
    ]
  }
];

export function normalizePublicResume(resume: TailoredResume, defaultResume?: TailoredResume): TailoredResume {
  const staleSummary = !resume.summary || resume.summary.includes("mobility") || resume.summary.includes("What is mobility");

  return {
    ...resume,
    headline: !resume.headline || resume.headline.includes("Backend Systems, AI Product Workflows") ? publicResumeHeadline : resume.headline,
    summary: staleSummary ? publicResumeSummary : resume.summary,
    skills: publicResumeSkillGroups,
    experience: resume.experience.length ? resume.experience : (defaultResume?.experience ?? resume.experience),
    projects: publicResumeNotableWork,
    education: resume.education.length ? resume.education : (defaultResume?.education ?? resume.education),
    keywords: Array.from(new Set([...(resume.keywords ?? []), ...recruiterKeywords]))
  };
}

export function createDefaultPublicResume(content: SiteContent): TailoredResume {
  return {
    profile: {
      name: content.profile.name,
      title: content.profile.title,
      email: content.profile.email,
      location: content.profile.location,
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
          "Own early product engineering for live streamer and content creator tooling across architecture, backend systems, frontend workflows, integrations, and product tradeoffs.",
          "Develop an AI-powered dev platform that ingests AI-processed SVG and Lottie widgets through a repeatable pipeline, reducing the manual effort required to build a large creator widget library.",
          "Turn ambiguous creator workflows into product surfaces designed for live, high-pressure usage and rapid early-stage iteration.",
          "Work close to founder priorities to move from product insight to usable creator tooling without overbuilding the first architecture."
        ]
      },
      {
        company: "Gryd.io",
        companyUrl: "https://www.gryd.io/",
        companyContext: "US company | remote",
        role: "Fractional CTO",
        period: "Dec 2024 - Present",
        bullets: [
          "Lead development and delivery of core products while balancing hands-on engineering, DevOps ownership, product architecture, and backend system decisions.",
          "Manage a small team of part-time developers with lightweight processes that keep execution efficient and maintainable.",
          "Evaluate and prototype AI and automation workflows for client-facing product needs and internal operations across Atlassian-based workflow systems."
        ]
      },
      {
        company: "Lumentis AI",
        companyUrl: "https://lumentis.ai/",
        companyContext: "German AI company | remote",
        role: "Software developer",
        period: "Apr 2024 - Sep 2024",
        bullets: [
          "Built 3 AI-first SaaS and enterprise applications across legal transcription, business report generation, and self-hostable conversational assistants.",
          "Shipped a subscription transcription product for a law firm using a fine-tuned, context-aware Whisper workflow, Stripe subscriptions, React, Django, and CloudFront.",
          "Delivered report generation and enterprise assistant products involving generated content, chart creation, PDF export, open-source LLM support, search, speech input, and sandboxed code execution."
        ]
      },
      {
        company: "StockX",
        companyUrl: "https://stockx.com/",
        companyContext: "US marketplace | India engineering office",
        role: "Software engineer",
        period: "Jun 2021 - Oct 2023",
        bullets: [
          "Led development and upkeep of RESTful microservices powering checkout and pricing business logic for a global ecommerce marketplace.",
          "Operated services across Golang, Node.js, Postgres, DynamoDB, Kafka, SQS, AWS, Kubernetes, CircleCI, Harness, and Datadog.",
          "Built domain depth across global marketplace operations, regulatory compliance, peak traffic performance, scalability, and fraud prevention."
        ]
      },
      {
        company: "Ola Electric",
        companyUrl: "https://www.olaelectric.com/",
        companyContext: "High-scale EV product company",
        role: "Software engineer",
        period: "Nov 2019 - May 2021",
        bullets: [
          "Built customer-facing web and backend systems for Ola Electric, including the official website, payment integrations, and scheduled/on-demand test-ride workflows.",
          "Integrated 2 payment providers, Adyen and PayU, using React, Node.js, Java Spring Boot, and MySQL.",
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
          "Developed and maintained enterprise web applications for scheduling and activation of production changes and software loads across the organization.",
          "Worked in a large travel technology environment across MEAN-stack workflows and Java-backed internal systems."
        ]
      }
    ],
    projects: publicResumeNotableWork,
    education: content.education,
    keywords: recruiterKeywords,
    notes: []
  };
}
