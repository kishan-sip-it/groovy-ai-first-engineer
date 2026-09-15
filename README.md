# Groovy Web — AI-First Engineer Journey

> **READ THIS FIRST.** This repository is the navigation hub for the 30-Day AI-First Engineer onboarding work. For any question about what a folder does, how to run it, or where the execution command lives, start here and jump to the linked run section.

## Submission links

### Live Vercel demo hub

**https://groovy-ai-gm994iph4-kishan11.vercel.app**

The Vercel submission hub contains three deployable mini-project demos:

- **Mini-Project 1 — Student Management CRUD**: [`/mini-project-1/`](./coding/days-06-15-ai-lab/vercel/mini-project-1/index.html)
- **Mini-Project 2 — Smart Doc Q&A**: [`/mini-project-2/`](./coding/days-06-15-ai-lab/vercel/mini-project-2/index.html)
- **Mini-Project 3 — Custom Agent**: [`/mini-project-3/`](./coding/days-06-15-ai-lab/vercel/mini-project-3/index.html)

The hosted demos are intentionally self-contained for submission reliability. The original full implementations remain in the repository and are documented below.

## Repository map

| Area | Purpose | Run / open |
|---|---|---|
| [`day-01/hello-ai`](./day-01/hello-ai/README.md) | Day 1 Hello AI prompt + screenshot evidence | Documentation/evidence only |
| [`day-02 TODO app`](https://github.com/kishan-sip-it/groovy-day-02-todo-app) | React + Node TODO/Kanban application | See that repo README |
| [`day-03/prompt-library.md`](./day-03/prompt-library.md) | 10 reusable prompt-engineering templates + selection matrix | Documentation only |
| [`coding/README.md`](./coding/README.md) | Coding-work index for Days 4–19 | Start here for coding projects |
| [`coding/day-05/student-crud`](./coding/day-05/student-crud/README.md) | React + Node + PostgreSQL CRUD + search/export | See project README |
| [`coding/days-06-15-ai-lab`](./coding/days-06-15-ai-lab/README.md) | Multi-provider CLI, streaming, RAG, agents + zero-key mock mode | See project README |
| [`coding/day-04/llm-comparison.md`](./coding/day-04/llm-comparison.md) | LLM comparison report + weighted scorecard | Documentation only |
| [`coding/day-12/chunking-comparison.md`](./coding/day-12/chunking-comparison.md) | Chunking/retrieval report | Documentation only |
| [`coding/day-14/agent-comparison.md`](./coding/day-14/agent-comparison.md) | Agent implementation comparison | Documentation only |
| [`coding/day-15/standup-agent.md`](./coding/day-15/standup-agent.md) | Real-use-case agent specification | Implementation lives in AI lab |
| [`coding/day-19`](./coding/day-19) | GitHub Actions + Render deployment + release preflight | See project README |
| [`CODING_STATUS.md`](./CODING_STATUS.md) | Evidence matrix for Days 1–30 | Current verification boundary |

## Unique engineering additions

- **Day 2:** keyboard-first command palette (`Ctrl/⌘+K`, `D/B/N/P`).
- **Day 3:** prompt selection matrix.
- **Day 4:** weighted 100-point model-selection scorecard.
- **Day 5:** searchable/filterable student admin view plus one-click CSV export.
- **Days 6–15:** offline `mock` provider for no-key CLI/stream verification.
- **Submission:** three self-contained Vercel mini-project demos linked from the live hub.
- **Day 19:** release preflight smoke gate executed by GitHub Actions.

## Fast execution index

### Day 2 — TODO / Kanban app

Open the separate repository: [groovy-day-02-todo-app](https://github.com/kishan-sip-it/groovy-day-02-todo-app).

### Day 5 — Student CRUD

```bash
cd coding/day-05/student-crud
npm install
npm run install:all
# Configure PostgreSQL DATABASE_URL as described in README.md
npm run dev
```

### Days 6–15 — AI Lab

```bash
cd coding/days-06-15-ai-lab
npm install
cp .env.example .env
# Add only the provider keys you actually have; never commit .env
npm run chat -- --provider mock "Smoke test the lab"
```

Useful entry points:

```bash
npm run chat
npm run stream
npm run explain
npm run agent
npm run rag
npm run bench
```

### Day 19 — CI/CD configuration

```bash
cd coding/day-19
node smoke-check.mjs
```

## Submission rule

All repository/code tasks that can be completed without company-controlled state should be represented with working code, documentation, or a runnable demo. Items that require senior review, a real Groovy/client repository, leadership judgment, cohort access, or formal assessment remain explicitly unclaimed.

API keys stay in environment variables or a secret manager. Never commit secrets to GitHub, README files, screenshots, or chat.
