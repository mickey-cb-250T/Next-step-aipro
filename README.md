# NextStep AI Pro
> An Intelligent Career Planning, Skill Intelligence & Portfolio Development Platform for engineering students, fresh graduates, and transitioning software engineers.

---

## 1. System Architecture

```
                             +----------------------------------------+
                             |       NextStep AI Pro Frontend         |
                             |   React 19 + Tailwind CSS + Lucide     |
                             +-------------------+--------------------+
                                                 |
                                    REST API / JSON Payloads
                                                 |
                             +-------------------+--------------------+
                             |      Full-Stack Express Server         |
                             |   - Vite Middleware (dev) / Static     |
                             |   - Semantic Token Matchers            |
                             |   - Deterministic Fallback Rules       |
                             +----+--------------+---------------+----+
                                  |              |               |
                                  v              v               v
           +--------------------------+  +---------------+  +--------------------------+
           |     Gemini 3.8 Flash     |  | GitHub REST   |  |   Client Storage Layer   |
           |  - Career Diagnostics    |  | API Inspector |  |  - LocalStorage Engine   |
           |  - Resume Gap Analysis   |  | (Tree, Tests, |  |  - JSON Data Export/Imp  |
           |  - Interview Evaluations |  |  README, CI)  |  |  - Session Persistence   |
           +--------------------------+  +---------------+  +--------------------------+
```

---

## 2. Core Capabilities & Problem Solved

### A. Non-Hallucinatory Career Planning
Unlike generic chatbots or surface-level dashboards that invent fake employability percentages, NextStep AI Pro evaluates **demonstrated project evidence vs. self-reported claims**.

### B. Topological Skill Intelligence (DAG)
Skills are structured as an **Acyclic Directed Graph (DAG)**. Advanced skills (like Distributed Transactions or System Design) remain **Locked** until foundational prerequisites (Programming Fundamentals, Data Structures, Relational Normalization) are verified at a competency level of 3/5 or higher.

### C. Adaptive Learning Roadmap
Personalized curriculum broken down into:
- Sequential milestones
- Clear learning objectives
- Concrete practical deliverables (e.g. *Build an in-memory token bucket rate limiter with unit tests*)
- Real effort tracking with automatic timeline recalculation based on the student's weekly hours commitment.

### D. Production Project Laboratory
Curated projects with full architectural specs, milestones, and testing requirements:
- **Distributed Token-Bucket API Gateway & Rate Limiter** (Redis, Lua, Docker, k6)
- **Realtime Conflict-Free Collaborative Document Editor** (React 19, Yjs CRDT, WebSockets)
- **Idempotent Financial Tick Ingestion & Metric Mart** (Python, DuckDB/PostgreSQL, dbt)
- **Hybrid Semantic Document Search & RAG Evaluation Engine** (pgvector/Chroma, Gemini API)
- **Zero-Trust OAuth 2.0 PKCE & RBAC Microservice Gateway** (TypeScript, RS256 JWKS)
- **Full-Stack Developer Analytics Platform** (Next.js/React 19, PostgreSQL, Webhooks)

### E. Evidence-Based Resume & Job Description Gap Analyzer
- Upload `.txt` or `.md` resume or paste text directly.
- Compares against target job postings.
- Delineates evidenced skills from unmentioned skills with zero permanent server retention.

### F. GitHub Portfolio Inspector
- Connects directly to the GitHub REST API.
- Audits README quality, automated unit test suites (`tests/`, `spec/`, `*.test.*`), GitHub Actions CI workflows, and package manifests.
- Delivers prioritized actionable commits to convert student coursework into interview-ready portfolios.

### G. Technical Interview Studio
- Realistic technical interview question bank (PostgreSQL B-Tree query planning, JavaScript event loop microtasks, REST idempotency & race conditions, React Fiber reconciliation, CAP theorem).
- Submits answers for rubric evaluation with Gemini 3.8 Flash (or deterministic rules engine fallback).
- Highlights covered concepts, missing mechanics, and suggested revision links.

---

## 3. Local Development

### Prerequisites
- Node.js >= 18.17.0
- npm >= 9.0.0

### Setup
```bash
# Clone the repository
git clone https://github.com/developer/next-step.git
cd next-step

# Install dependencies
npm install

# Start full-stack dev server (Express + Vite)
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 4. Environment Variables (`.env`)

```bash
# Optional: GEMINI_API_KEY for real-time generative career reasoning.
# If omitted, NextStep AI Pro automatically activates the deterministic rules engine.
GEMINI_API_KEY=""

# Application Port (defaults to 3000)
PORT=3000
```

---

## 5. Production Build & Deployment

```bash
# Type check and build Vite frontend assets
npm run build

# Start the production Node server
npm start
```

---

## 6. Security, Privacy & Design Principles

- **Zero-Pill Restrained Design**: Editorial dark aesthetic inspired by developer tools like Linear and Notion. No purple gradient AI decorations or fake metrics.
- **Privacy-Safe In-Memory Processing**: Resumes and interview submissions are analyzed in-memory. No raw text is stored on external databases without explicit user consent.
- **Deterministic Fallbacks**: Every AI call includes a fallback to deterministic parsing and scoring, ensuring 100% uptime regardless of upstream quota or missing API keys.
