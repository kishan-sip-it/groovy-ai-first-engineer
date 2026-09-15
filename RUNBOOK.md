# Groovy Web Onboarding — Execution Runbook

> **Start here for execution.** Every runnable deliverable has its exact working-directory, install command, start command, health check, and next documentation link below.

## 1. Day 1 — Hello AI

Path: `day-01/hello-ai/`

Type: evidence/documentation only. There is no application to run.

Open [`day-01/hello-ai/README.md`](./day-01/hello-ai/README.md) and the screenshot in `screenshots/`.

## 2. Day 2 — TODO + Kanban app

Repository: https://github.com/kishan-sip-it/groovy-day-02-todo-app

Working directory after cloning:

```bash
cd ~/groovy-day-02-todo-app
```

Install and run:

```bash
npm install
npm --prefix backend install
npm --prefix frontend install
npm run dev
```

Open:

- Frontend: http://localhost:5173
- Backend health: http://localhost:4000/api/health

Browser verification:

1. Open Dashboard.
2. Open Board.
3. Create a task.
4. Edit a task.
5. Change priority/status.
6. Drag between columns.
7. Search/filter.
8. Delete a task.
9. Confirm no browser/API errors.

## 3. Day 3 — Prompt library

Path: `day-03/prompt-library.md`

Type: documentation only. No runtime command.

Deliverable: ten reusable engineering prompt templates.

## 4. Day 5 — Student CRUD

Path: `coding/day-05/student-crud/`

Prerequisite: PostgreSQL.

```bash
cd coding/day-05/student-crud
npm install
npm run install:all
```

Create the database and apply [`backend/schema.sql`](./coding/day-05/student-crud/backend/schema.sql), then configure `DATABASE_URL` in the backend environment.

Run:

```bash
npm run dev
```

Open:

- Frontend: http://localhost:5173
- Backend health: http://localhost:4100/api/health

Run backend tests:

```bash
npm test
```

## 5. Days 6–15 — AI Lab

Path: `coding/days-06-15-ai-lab/`

Install:

```bash
cd coding/days-06-15-ai-lab
npm install
cp .env.example .env
```

Put only available provider keys in `.env`. Never commit `.env`.

Available commands:

```bash
npm run chat
npm run stream
npm run explain
npm run agent
npm run rag
npm run bench
```

These map to the checklist areas for multi-provider chat, streaming/retry hygiene, codebase explanation, tool use/agents, RAG, and benchmarking.

## 6. Day 19 — CI/CD configuration

Path: `coding/day-19/`

Type: deployment configuration. It is not a local application server.

Inspect:

- `.github/workflows/ci.yml`
- `render.yaml`

Actual deployment execution requires a connected GitHub Actions/Render environment and the required repository secrets.

## 7. Report-only checklist items

The following are intentionally not represented as fake local execution:

- company Slack/Teams actions
- paid provider credits/API keys that are not available
- assigned Groovy client repository work
- senior/cohort review actions
- leadership demo/feedback
- Stage 1 assessment
- real client capstone deployment

For those items, the repository documents the implementation boundary instead of inventing evidence.

## Navigation rule

For any project question, open the nearest README first, then follow its **Run / Verify** links. GitHub relative links are used so navigation remains valid in clones. 
