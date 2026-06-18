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
  return content.resumeLab.publicResume ?? createDefaultPublicResume(content);
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
    headline: "Senior Full-Stack Engineer | Backend Systems, AI Product Workflows, Technical Leadership",
    summary:
      "Senior full-stack engineer with 8+ years across marketplace systems, mobility, travel technology, AI products, and startup product engineering. Owns ambiguous backend-heavy work end to end: architecture, APIs, data modelling, integrations, deployments, and pragmatic delivery. Currently a founding engineer building an AI-powered creator tooling dev platform and a fractional CTO leading product architecture, developer execution, DevOps, and AI workflow experiments for startup teams.",
    skills: [
      {
        title: "Backend and product systems",
        items: ["Backend architecture", "REST APIs", "Microservices", "Data modelling", "PostgreSQL", "DynamoDB", "Kafka", "SQS", "Payments", "Subscriptions"]
      },
      {
        title: "AI and workflow automation",
        items: ["AI product workflows", "LLM integrations", "SVG and Lottie ingestion", "Local-first RAG", "Bhashini ASR", "Context-aware transcription", "Report generation", "Workflow automation"]
      },
      {
        title: "Full-stack implementation",
        items: ["React", "Node.js", "Django", "FastAPI", "Golang", "Java Spring Boot", "TypeScript", "JavaScript", "MongoDB"]
      },
      {
        title: "Technical leadership",
        items: ["Technical direction", "Product architecture", "DevOps ownership", "Developer management", "Hiring and interviewing", "Delivery ownership", "Stakeholder tradeoffs"]
      },
      {
        title: "Cloud and operations",
        items: ["AWS", "Kubernetes", "CircleCI", "Harness", "Datadog", "Stripe", "Azure", "CloudFront", "Firebase"]
      }
    ],
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
    projects: [
      {
        name: "AI-powered creator widget dev platform",
        context: "Stealth startup | creator tooling",
        bullets: [
          "Developed a pipeline-oriented platform for ingesting AI-processed SVG and Lottie widget assets, normalizing them into reusable creator-facing components, and reducing repetitive manual build effort.",
          "Owned product and technical tradeoffs across early architecture, backend workflows, frontend tooling, integrations, and iteration speed for a creator tools startup."
        ]
      },
      {
        name: "Business report automation",
        context: "Lumentis AI | document automation",
        bullets: [
          "Built a report builder with AI-generated content, CSV-driven charts, template control, live previews, version history, and PDF export."
        ]
      },
      {
        name: "Ledger Lens local-first finance explainer",
        context: "Public GitHub project | privacy-first finance tooling",
        bullets: [
          "Built a local-first Python finance explainer that ingests CSV and text-based PDF statements, sanitizes transaction text, embeds evidence locally, and stores retrieval context in LanceDB.",
          "Designed the product boundary so deterministic code computes financial facts while retrieval and optional LLM layers explain only sanitized evidence."
        ]
      },
      {
        name: "India Stock Discovery Agent",
        context: "Public GitHub project | financial research tooling",
        bullets: [
          "Built a FastAPI and React research app for investor profiling, deterministic suitability guardrails, Indian stock research candidates, and local decision journaling.",
          "Kept risk controls in native Python application logic so the app supports research workflows without relying on prompt-only buy/sell safeguards."
        ]
      },
      {
        name: "Satsang Lekhan Hindi transcription PWA",
        context: "Public GitHub project | Hindi speech-to-text and language tooling",
        bullets: [
          "Built a React and Firebase PWA for long-form Hindi speech-to-text, using browser recording, automatic audio chunking, Firebase Cloud Functions, Bhashini ASR, and Firestore chapter sync.",
          "Added Google sign-in, per-user chapter storage, local autosave, spoken punctuation handling, copy, print, export, and installable mobile PWA behavior for family use."
        ]
      }
    ],
    education: content.education,
    keywords: [
      "Senior full-stack engineer",
      "Backend architecture",
      "Product engineering",
      "AI workflows",
      "LLM integrations",
      "Local-first RAG",
      "LanceDB",
      "FastAPI",
      "Bhashini ASR",
      "Firebase",
      "PWA",
      "SVG ingestion",
      "Lottie ingestion",
      "Creator tooling",
      "Microservices",
      "REST APIs",
      "Data modelling",
      "PostgreSQL",
      "Golang",
      "Node.js",
      "React",
      "Django",
      "AWS",
      "Kubernetes",
      "Kafka",
      "SQS",
      "Stripe",
      "DevOps",
      "Technical leadership",
      "Marketplace systems",
      "Payments",
      "Startup engineering"
    ],
    notes: []
  };
}
