// All site content lives here. Every claim must be backed by the resume.

export const profile = {
  name: 'Priyansh Jain',
  role: 'Software Engineer II',
  company: 'Rippling',
  location: 'Bengaluru, India',
  email: 'priyansh0192@gmail.com',
  github: 'https://github.com/Jainpriyansh08',
  linkedin: 'https://www.linkedin.com/in/priyansh-jain-b66358191/',
  resume: './Priyansh_Jain_Resume.pdf',
  intro:
    'I build payment rails, identity platforms and AI agents that run in production. This map shows the systems I’ve shipped and what each one changed.',
}

// Map coordinates are in a 16 × 9 grid, origin bottom-left. Lines are drawn
// through `path`; stations sit on path points. `side` places the label.
export const lines = [
  {
    id: 'blue',
    name: 'Blue Line',
    company: 'Rippling',
    role: 'Software Engineer II',
    period: 'May 2026 – present',
    years: '2026–now',
    location: 'Bengaluru',
    blurb:
      'Leading architecture of contractor lifecycle and compliance platforms, bulk workforce infrastructure, API reliability, and AI-powered operational automation.',
    path: [[7.2, 7], [10.4, 7], [12.6, 7], [14.6, 7], [15.2, 7], [15.2, 5.4]],
    origin: { at: [7.2, 7], side: 'above-start', title: 'Rippling', sub: 'May 2026' },
    stations: [
      {
        id: 'b1', at: [12.6, 7], side: 'above',
        title: '25–30 → <10 a week', sub: 'Escalations',
        text: 'Designed and shipped an MCP tool-calling LLM agent across the Contractors stack, with hybrid RAG and reranking over runbooks and incidents, intent routing, and confidence-gated escalation in internal bots. Escalations fell from 25–30 a week to under 10, and more than 65% of recurring toil went away.',
      },
      {
        id: 'b2', at: [14.6, 7], side: 'below-end',
        title: '$10M+ book covered', sub: 'AI risk attestation',
        text: 'Architected and scaled contractor lifecycle infrastructure for bulk onboarding, hiring and transitions, and built a 0→1 automated attestation system with AI-assisted risk flagging that surfaces worker-classification risk across a $10M+ Contractor of Record book, replacing manual Legal and Ops review.',
      },
      {
        id: 'b3', at: [15.2, 5.4], side: 'left', here: true,
        title: '~70% of gaps closed', sub: 'p95/p99 API SLOs',
        text: 'DRI for API reliability: defined p95/p99 latency and error-budget SLOs with Datadog tracing across APIs, then root-caused and fixed N+1 queries, retry storms, and missing timeouts and circuit breakers, closing about 70% of reliability gaps week over week and cutting customer-facing tail latency.',
      },
    ],
  },
  {
    id: 'yellow',
    name: 'Yellow Line',
    company: 'MoEngage',
    role: 'Software Engineer',
    period: 'Jul 2025 – May 2026',
    years: '2025–26',
    location: 'Bengaluru',
    blurb:
      'Backend engineer building GenAI automation, enterprise identity infrastructure, and fault-tolerant event-driven systems.',
    path: [[7.6, 0.5], [7.6, 2], [7.6, 3.4], [7.6, 4.2], [8.6, 5.2], [9.6, 6.2], [10.4, 7]],
    origin: { at: [7.6, 0.5], side: 'right', title: 'MoEngage', sub: 'Jul 2025' },
    stations: [
      {
        id: 'y1', at: [7.6, 3.4], side: 'right',
        title: '4x auth throughput', sub: 'OAuth + SCIM, <50 ms',
        text: 'Led 0→1 design and build of an automated IAM platform with JIT and SCIM provisioning, ending manual enterprise onboarding. Re-architected OAuth 2.0 identity pipelines and distributed session management for a 4x throughput increase at sub-50 ms latency, with zero-downtime rollouts via ArgoCD on Kubernetes.',
      },
      {
        id: 'y2', at: [8.6, 5.2], side: 'right-down',
        title: 'Kafka + SQS pipelines', sub: 'With dead-letter queues',
        text: 'Designed fault-tolerant, event-driven pipelines on Kafka and Amazon SQS to decouple core microservices, using dead-letter queues and retry backoff, with real-time observability through AWS Alarms and Grafana.',
      },
      {
        id: 'y3', at: [9.6, 6.2], side: 'right-down',
        title: '8 h → under 2 min', sub: 'GenAI sales decks',
        text: 'Built GenAI automation on Vertex AI, n8n and MCP, orchestrating multi-step agents over CRM and product data. Sales-deck generation went from 8 hours to under 2 minutes (99% faster), and reusable agent skills for code generation and debugging cut prompt overhead by 60%.',
      },
    ],
  },
  {
    id: 'red',
    name: 'Red Line',
    company: 'Betterhalf.ai (YC W’21)',
    role: 'Software Engineer',
    period: 'Jan 2023 – Jun 2025',
    years: '2023–25',
    location: 'Bengaluru',
    blurb:
      'Owned architecture of the financial and booking platforms, scaling infrastructure to ₹150Cr+ in monthly transactions, plus enterprise-wide workflow automation.',
    path: [[1, 2], [3.2, 2], [5.4, 2], [7.6, 2], [9.8, 2], [10.6, 2], [12, 3.4]],
    origin: { at: [1, 2], side: 'below-start', title: 'Betterhalf.ai', sub: 'Jan 2023' },
    stations: [
      {
        id: 'r1', at: [3.2, 2], side: 'below',
        title: '10x payment capacity', sub: 'UPI rails, <100 ms',
        text: 'Led a pod of two engineers to architect a high-throughput multi-rail payment engine (UPI, instalments), scaling capacity 10x at sub-100 ms latency. Built a distributed state machine and a double-entry ledger on PostgreSQL and Redis to enforce idempotency and automate reconciliation across ICICI and DBS rails.',
      },
      {
        id: 'r2', at: [5.4, 2], side: 'below',
        title: '₹150Cr+ a month', sub: 'Marketplace bookings',
        text: 'Scaled the Weddings marketplace to ₹150Cr+ in monthly bookings by migrating to a decoupled microservices architecture. High-throughput discovery flows drove a 3x boost in organic visibility and a 300%+ increase in venue engagement.',
      },
      {
        id: 'r3', at: [9.8, 2], side: 'below',
        title: '3 days → under 60 s', sub: 'Proposal generation',
        text: 'Built a 0→1 asynchronous proposal engine on GCP Cloud Functions, Celery and distributed task queues, orchestrating Canva-integrated microservices. Generation time fell from 3 days to under 60 seconds, removing the manual workflow entirely.',
      },
      {
        id: 'r4', at: [12, 3.4], side: 'right',
        title: '+75% lead conversion', sub: 'Chat, CRM routing, pricing',
        text: 'Led engineering across monetization, growth and automation: real-time chat, CRM routing, dynamic pricing and recommendation systems validated through A/B testing. Results: ₹60K a day in new revenue, 75% better lead conversion, ₹6L a day in operational savings, and 40% faster QA turnaround.',
      },
    ],
  },
]

// Transfer stations: a skill carried from one line to the next.
export const interchanges = [
  { id: 'x1', at: [7.6, 2], side: 'above-right', lines: ['red', 'yellow'], title: 'Microservices', sub: 'Red ↔ Yellow', href: '#st-r2' },
  { id: 'x2', at: [10.4, 7], side: 'above', lines: ['yellow', 'blue'], title: 'MCP agents', sub: 'Yellow ↔ Blue', href: '#st-b1' },
]

export const projects = [
  {
    line: 'green',
    title: 'Semantic search and chat assistant',
    description:
      'A production-grade RAG system using LangChain, FAISS and OpenAI embeddings for semantic retrieval over unstructured documents. I benchmarked chunking strategies and embedding configurations with retrieval eval pipelines to improve answer relevance and reduce hallucinations.',
    stack: ['LangChain', 'FAISS', 'OpenAI embeddings', 'Retrieval evals'],
    link: 'https://github.com/Jainpriyansh08/AI_RAG_Powered_Chat_Assistant',
  },
  {
    line: 'violet',
    title: 'AkhandJyoti, Bihar: healthcare operations',
    description:
      'Solely designed and built booking infrastructure that processes 100K+ transactions a day. Tuned MongoDB and PostgreSQL with aggregation pipelines, compound indexes and sharding for high availability without write locks.',
    stack: ['MongoDB', 'PostgreSQL', 'Sharding'],
    link: 'https://github.com/Jainpriyansh08/akhandjyoti-bookingsystem',
  },
  {
    line: 'magenta',
    title: 'Thomas Scott: e-commerce listings',
    description:
      'A portal that manages product listings across Ajio, Myntra and Amazon from one place, with WeShop AI canvas integration for automated, customizable product images and video.',
    stack: ['Java', 'Spring Boot', 'PostgreSQL'],
    link: 'https://github.com/Jainpriyansh08/thomasscott-backend',
  },
]

// Station index: where each technology was used, by line. Only usage the
// resume states is mapped.
export const stationIndex = [
  ['Amazon SQS', ['yellow']],
  ['ArgoCD', ['yellow']],
  ['AWS', ['yellow']],
  ['Celery', ['red']],
  ['Datadog', ['blue']],
  ['FAISS', ['green']],
  ['GCP Cloud Functions', ['red']],
  ['Grafana', ['yellow']],
  ['Java', ['magenta']],
  ['Kafka', ['yellow']],
  ['Kubernetes', ['yellow']],
  ['LangChain', ['green']],
  ['MCP', ['yellow', 'blue']],
  ['Microservices', ['red', 'yellow']],
  ['MongoDB', ['violet']],
  ['n8n', ['yellow']],
  ['OAuth 2.0 + SCIM', ['yellow']],
  ['PostgreSQL', ['red', 'violet', 'magenta']],
  ['RAG', ['blue', 'green']],
  ['Redis', ['red']],
  ['Spring Boot', ['magenta']],
  ['Vertex AI', ['yellow']],
]

export const toolbox =
  'Python, Go, C++, JavaScript, Django, FastAPI, Falcon, React, REST, GraphQL, SQL, S3, Supabase, Google Pub/Sub, Docker, Airflow, Terraform, Jenkins, Prometheus, embeddings, LLM evals, prompt orchestration, NumPy, Pandas, Claude Code.'

export const lineNames = {
  red: 'Red Line · Betterhalf.ai',
  yellow: 'Yellow Line · MoEngage',
  blue: 'Blue Line · Rippling',
  green: 'Green Line · RAG assistant',
  violet: 'Violet Line · AkhandJyoti',
  magenta: 'Magenta Line · Thomas Scott',
}

export const education = {
  degree: 'B.Tech in Information Technology',
  school: 'Manipal University Jaipur',
  detail: 'CGPA 8.4 / 10',
}

export const recognition = [
  { title: 'Top 5% of cohort, AI First Product Management fellowship', org: 'Airtribe', when: 'Apr – Jul 2025' },
  { title: 'Most Impactful Business Idea (top 10%)', org: 'EngageAI Hackathon', when: 'Nov – Dec 2025' },
]
