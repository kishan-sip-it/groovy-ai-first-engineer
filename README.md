# Groovy Web — AI-First Engineer Journey

> **READ THIS FIRST.** This repository is the navigation hub for the 30-Day AI-First Engineer onboarding work. For any question about what a folder does, how to run it, or where the execution command lives, start here and jump to the linked run section.

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

## Unique engineering additions

These enhancements are deliberately small, practical, and visible:

- **Day 2:** keyboard-first command palette (`Ctrl/⌘+K`, `D/B/N/P`) for fast workspace navigation.
- **Day 3:** prompt selection matrix that maps engineering situations to the right reusable prompt template.
- **Day 4:** weighted 100-point LLM decision scorecard with reproducibility guidance.
- **Day 5:** searchable/filterable student admin view plus one-click CSV export.
- **Days 6–15:** offline `mock` provider for no-key verification of CLI routing and streaming without provider credits.
- **Day 19:** release preflight smoke gate executed by GitHub Actions before deployment.

## Fast execution index

### Day 2 — TODO / Kanban app

Open the separate repository: [groovy-day-02-todo-app](https://github.com/kishan-sip-it/groovy-day-02-todo-app). Its README contains the exact install, run, health-check, keyboard shortcut, and browser verification sequence.

### Day 5 — Student CRUD

```bash
cd coding/day-05/student-crud
npm install
npm run install:all
# Configure PostgreSQL DATABASE_URL as described in README.md
npm run dev
```

Frontend: `http://localhost:5173`
Backend health: `http://localhost:4100/api/health`

Full instructions: [`coding/day-05/student-crud/README.md`](./coding/day-05/student-crud/README.md).

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

Full setup, environment variables, provider selection, and examples are in [`coding/days-06-15-ai-lab/README.md`](./coding/days-06-15-ai-lab/README.md).

### Day 19 — CI/CD configuration

The deployment configuration and release preflight are in [`coding/day-19`](./coding/day-19).

Local preflight:

```bash
cd coding/day-19
node smoke-check.mjs
```

## Documentation navigation rule

Every project-level README begins with a **READ THIS FIRST** instruction and points back to the relevant execution section. GitHub relative links are used for repository navigation because they remain valid in clones. citeturn383458search0turn383458search2

## Important prerequisites

Some checklist work depends on resources that cannot be safely fabricated in a personal trial repository: company Slack/Teams access, paid provider credits/API keys, an assigned Groovy client repository, senior review, deployment credentials, and the Stage 1 assessment. Those items remain explicitly marked rather than represented as completed evidence.

API keys must stay in environment variables or a secret manager. Do not paste them into GitHub, README files, screenshots, or chat.

## Evidence / status

See [`CODING_STATUS.md`](./CODING_STATUS.md) for the current implementation map and verification state.

## One-command navigation

For the complete execution map, open [`RUNBOOK.md`](./RUNBOOK.md).
