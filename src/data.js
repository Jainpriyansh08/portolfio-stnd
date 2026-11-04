// All site content lives here — edit this file to update the portfolio.

export const profile = {
  name: 'Priyansh Jain',
  role: 'Software Engineer II',
  company: 'Rippling',
  location: 'Bengaluru, India',
  email: 'priyansh0192@gmail.com',
  github: 'https://github.com/Jainpriyansh08',
  linkedin: '', // TODO: add your LinkedIn URL, e.g. https://www.linkedin.com/in/<handle>
  resume: './Priyansh_Jain_Resume.pdf',
  tagline:
    'I design and build high-performance distributed systems, financial infrastructure, and agentic AI that removes operational toil.',
  summary:
    'Software engineer with a track record of architecting 0→1 platforms — from a multi-rail payment engine and double-entry ledger moving ₹150Cr+ a month, to identity platforms, to MCP tool-calling agents that run in production. I care about reliability, clean event-driven design, and making engineering teams faster.',
  roles: ['Distributed Systems', 'Payments Infrastructure', 'Agentic AI', 'API Reliability', 'Event-Driven Architecture'],
}

export const stats = [
  { value: '₹150Cr+', label: 'monthly volume on systems I built' },
  { value: '$10M+', label: 'contractor book protected by compliance tooling' },
  { value: '10x', label: 'payment capacity scaled at sub-100ms' },
  { value: '65%+', label: 'recurring toil eliminated with AI agents' },
]

export const experience = [
  {
    company: 'Rippling',
    role: 'Software Engineer II',
    period: 'May 2026 — Present',
    location: 'Bengaluru',
    blurb: 'Leading architecture of contractor lifecycle & compliance platforms, bulk workforce infrastructure, API reliability, and AI-powered operational automation.',
    points: [
      'Designed and shipped an MCP tool-calling LLM agent across the Contractors stack with hybrid RAG + reranking over runbooks and incidents, intent routing and confidence-gated escalation — escalations dropped from 25–30/week to <10, eliminating 65%+ of recurring toil.',
      'Architected contractor lifecycle infrastructure for bulk onboarding, hiring and transitions; built a 0→1 automated attestation system with AI-assisted risk flagging across a $10M+ Contractor of Record book, replacing manual Legal/Ops review.',
      'DRI for API reliability: defined p95/p99 latency and error-budget SLOs with Datadog tracing; fixed N+1 queries, retry storms and missing timeouts/circuit breakers, closing ~70% of reliability gaps week-over-week.',
    ],
    tags: ['MCP', 'RAG', 'Python', 'Datadog', 'SLOs'],
  },
  {
    company: 'MoEngage',
    role: 'Software Engineer',
    period: 'Jul 2025 — May 2026',
    location: 'Bengaluru',
    blurb: 'Backend engineer building GenAI automation, enterprise identity infrastructure, and fault-tolerant event-driven systems.',
    points: [
      'Led 0→1 design of an automated IAM platform with JIT and SCIM provisioning; re-architected OAuth 2.0 pipelines and distributed session management for 4x throughput at sub-50ms latency, with zero-downtime rollouts via ArgoCD on Kubernetes.',
      'Built fault-tolerant event-driven pipelines on Kafka and Amazon SQS with dead-letter queues and retry backoff; real-time observability via AWS Alarms and Grafana.',
      'Built GenAI automation on Vertex AI, n8n and MCP — multi-step agents over CRM and product data cut sales-deck generation from 8 hours to <2 minutes, and reusable agent skills cut prompt overhead by 60%.',
    ],
    tags: ['OAuth 2.0', 'SCIM', 'Kafka', 'SQS', 'Kubernetes', 'Vertex AI'],
  },
  {
    company: 'Betterhalf.ai (YC W’21)',
    role: 'Software Engineer',
    period: 'Jan 2023 — Jun 2025',
    location: 'Bengaluru',
    blurb: 'Owned architecture of financial & booking platforms, scaling infrastructure to ₹150Cr+ monthly transactions and enterprise-wide workflow automation.',
    points: [
      'Led a pod of 2 to architect a multi-rail payment engine (UPI, instalments), scaling capacity 10x at sub-100ms; built a distributed state machine and double-entry ledger on PostgreSQL/Redis for idempotency and automated reconciliation across ICICI and DBS rails.',
      'Scaled the Weddings marketplace to ₹150Cr+ monthly bookings by moving to decoupled microservices; discovery flows drove 3x organic visibility and 300%+ venue engagement.',
      'Built a 0→1 async proposal engine on GCP Cloud Functions, Celery and task queues with Canva-integrated services — generation time from 3 days to under 60 seconds.',
      'Led monetization, growth and automation work — real-time chat, CRM routing, dynamic pricing and recommendations — adding ₹60K/day revenue, +75% lead conversion, ₹6L/day operational savings and 40% faster QA.',
    ],
    tags: ['Payments', 'PostgreSQL', 'Redis', 'Celery', 'GCP', 'Microservices'],
  },
]

export const projects = [
  {
    title: 'Semantic Search & Chat Assistant',
    kind: 'AI · RAG',
    description:
      'Production-grade Retrieval-Augmented Generation system using LangChain, FAISS and OpenAI embeddings. Benchmarked chunking strategies and embedding configs with retrieval eval pipelines to improve relevance and reduce hallucinations.',
    stack: ['LangChain', 'FAISS', 'OpenAI', 'Python', 'Evals'],
    link: 'https://github.com/Jainpriyansh08', // TODO: point to the project repo
  },
  {
    title: 'AkhandJyoti — Healthcare Ops Platform',
    kind: 'Backend · Scale',
    description:
      'Solely designed and built booking infrastructure processing 100K+ daily transactions; tuned MongoDB and PostgreSQL with aggregation pipelines, compound indexes and sharding for high availability without write locks.',
    stack: ['MongoDB', 'PostgreSQL', 'Sharding', 'Python'],
    link: 'https://github.com/Jainpriyansh08', // TODO: point to the project repo
  },
  {
    title: 'Thomas Scott — E-Commerce Listings',
    kind: 'Platform · Automation',
    description:
      'Portal to manage product listings across Ajio, Myntra and Amazon from one place, with WeShop AI canvas integration for automated, customizable product image and video generation.',
    stack: ['Java', 'Spring Boot', 'PostgreSQL', 'GenAI'],
    link: 'https://github.com/Jainpriyansh08', // TODO: point to the project repo
  },
]

export const skills = [
  { group: 'Languages & Frameworks', items: ['Python', 'Java', 'Go', 'C++', 'JavaScript', 'Django', 'FastAPI', 'Spring Boot', 'React', 'Falcon', 'REST', 'GraphQL'] },
  { group: 'Data & Storage', items: ['PostgreSQL', 'MongoDB', 'Redis', 'SQL', 'S3', 'Supabase'] },
  { group: 'Distributed Systems & Infra', items: ['Kafka', 'Pub/Sub', 'Amazon SQS', 'Celery', 'Kubernetes', 'Docker', 'Airflow', 'AWS', 'GCP', 'Terraform', 'ArgoCD', 'Jenkins', 'Prometheus', 'Datadog'] },
  { group: 'AI / ML', items: ['Agentic AI', 'MCP', 'RAG', 'Embeddings', 'LLM Evals', 'LangChain', 'FAISS', 'Vertex AI', 'n8n', 'Claude Code', 'NumPy', 'Pandas'] },
]

export const education = {
  degree: 'B.Tech, Information Technology',
  school: 'Manipal University Jaipur',
  detail: 'CGPA 8.4 / 10',
}

export const achievements = [
  { title: 'Top 5% — AI First Product Management Fellowship', org: 'Airtribe', when: 'Apr – Jul 2025' },
  { title: 'Most Impactful Business Idea (Top 10%)', org: 'EngageAI Hackathon', when: 'Nov – Dec 2025' },
]
