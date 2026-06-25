import type { SiteContent } from "./content";

export const siteNotableWork: SiteContent["projects"] = [
  {
    name: "StockX global marketplace backend systems",
    client: "StockX",
    role: "Software engineer",
    year: "Full-time role",
    theme: "Marketplace checkout and pricing",
    summary:
      "Built and operated checkout and pricing microservices for StockX's global marketplace, contributing to backend systems behind a platform that surpassed 50M+ lifetime trades, 15M+ buyers, and 1.7M sellers by 2023.",
    challenge:
      "The marketplace backend had to support high traffic, pricing and checkout correctness, asynchronous workflows, deployment safety, regulatory constraints, and fraud-risk considerations across production services.",
    outcome:
      "Worked across Go, Node.js, PostgreSQL, DynamoDB, Kafka, SQS, AWS, Kubernetes, CircleCI, Harness, and Datadog while building reliability and domain depth in global marketplace operations.",
    stack: ["Go", "Node.js", "PostgreSQL", "DynamoDB", "Kafka", "SQS", "AWS", "Kubernetes", "Datadog"]
  },
  {
    name: "AI-first SaaS and enterprise product suite",
    client: "Lumentis AI",
    role: "Software developer",
    year: "6-month build sprint",
    theme: "AI SaaS and enterprise automation",
    summary:
      "Shipped 3 AI-first SaaS and enterprise products in 6 months: legal transcription with Whisper, business report generation with AI-generated content/charts/PDF export, and a self-hostable enterprise assistant.",
    challenge:
      "Each product needed AI output to become reliable business software: editable documents, subscriptions, persistence, chart/report generation, search, speech input, model portability, and controlled execution.",
    outcome:
      "Delivered workflows with React, Django, Stripe, CloudFront, Whisper, open-source LLM support, Tavily search, persistence, and sandboxed execution across client-facing and enterprise contexts.",
    stack: ["React", "Django", "Stripe", "Whisper", "OpenAI API", "Grok", "Tavily", "CloudFront"]
  },
  {
    name: "Fractional CTO architecture and delivery",
    client: "Gryd.io",
    role: "Fractional CTO",
    year: "Current",
    theme: "Startup architecture and delivery",
    summary:
      "Lead architecture and delivery for a US startup, managing a small part-time engineering team while owning backend architecture, DevOps, Atlassian Marketplace apps, CRM/marketing automation, AI workflow prototyping, and production release tradeoffs.",
    challenge:
      "The work spans product discovery, architecture decisions, developer execution, infrastructure, release scope, and stakeholder tradeoffs without the overhead of a large engineering org.",
    outcome:
      "Balance hands-on engineering with technical direction, lightweight process, architecture review, production release decisions, and fast iteration across startup product builds.",
    stack: ["Fractional CTO", "Product architecture", "Backend systems", "DevOps", "Atlassian Marketplace", "AI workflows"]
  },
  {
    name: "Ola Electric launch-period customer systems",
    client: "Ola Electric",
    role: "Software engineer",
    year: "Full-time role",
    theme: "EV launch systems",
    summary:
      "Built customer-facing web and backend systems during Ola Electric's high-demand EV launch period, including official website work, Adyen/PayU payments, and scheduled/on-demand test-ride workflows.",
    challenge:
      "The launch cycle saw 100k+ bookings in 24 hours and about 500k first-month bookings, so customer-facing flows needed to handle demand while supporting payments, booking workflows, and service deployments.",
    outcome:
      "Worked across React, Node.js, Java Spring Boot, MySQL, Jenkins, Marathon, Mesos, and Azure, while also leading external contractors, interviewing, and mentoring new joiners.",
    stack: ["React", "Node.js", "Java Spring Boot", "MySQL", "Adyen", "PayU", "Jenkins", "Azure"]
  },
  {
    name: "AI-powered creator widget platform",
    client: "Stealth startup",
    role: "Founding engineer",
    year: "Current",
    theme: "Creator tooling dev platform",
    summary:
      "Developing an AI-powered dev platform for creator widgets, focused on turning AI-processed SVG and Lottie assets into reusable interactive units through a pipeline-driven ingestion flow.",
    challenge:
      "The product needs a large library of creator-ready widgets, but building each widget manually would be slow, repetitive, and hard to scale while the product direction is still evolving.",
    outcome:
      "Own the platform architecture and full-stack implementation for a pipeline that reduces manual widget-building effort and gives the team a faster path from generated assets to usable creator tooling.",
    stack: ["Founding engineering", "AI-powered dev platform", "SVG ingestion", "Lottie ingestion", "Pipeline architecture", "Full-stack systems"]
  }
];
