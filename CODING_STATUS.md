<!-- READ THIS FIRST: this file summarizes implementation boundaries and verification status. Use README.md for navigation and RUNBOOK.md for exact commands. -->

# 30-Day Coding Status

## Checklist-to-code matrix

| Day | Checklist deliverable | Repository status |
|---|---|---|
| 1 | Hello AI + setup evidence | Done for repo-side evidence; Slack/API access remains external |
| 2 | React + Node TODO app | **Done** in separate `groovy-day-02-todo-app`; Kanban + command palette added |
| 3 | `prompt-library.md` with 10 templates | **Done** + prompt selection matrix |
| 4 | LLM comparison report | **Done** + weighted scorecard |
| 5 | Student Management CRUD, React + Node + Postgres | **Done** + search/filter + CSV export |
| 6 | Anthropic first call + CLI chatbot | **Implemented**; live call requires credentials |
| 7 | OpenAI/Gemini multi-provider CLI + benchmark | **Implemented**; live benchmark requires credentials |
| 8 | Streaming + retry/error hygiene | **Implemented** |
| 9 | Prompt caching / telemetry / codebase explainer | **Implemented** where credentials or service state are not required |
| 10 | Smart Doc Q&A | **Implemented** locally in AI lab |
| 11 | Embeddings + vector store RAG upgrade | **Implemented** with local/vector-adapter path |
| 12 | Chunking comparison | **Done** as comparison report/framework |
| 13 | Tool-use / function-calling agent | **Implemented** |
| 14 | Multi-step agent + framework comparison + memory | **Implemented** as pure-SDK architecture plus comparison |
| 15 | Real-use-case agent | **Implemented** as standup assistant + tool loop |
| 16 | Assigned real Groovy repo onboarding | **External dependency** — requires actual assigned client repo |
| 17 | First real PR | **External dependency** — requires actual client repository and reviewer |
| 18 | Review 3 cohort PRs | **External dependency** — requires cohort PR access |
| 19 | CI/CD + deploy | **Implemented** with CI + Render config + release preflight; live deploy requires credentials |
| 20–24 | Real client capstone | **External dependency** — requires assigned client feature/repo and senior feedback |
| 25 | Stage 1 assessment | **External process** |
| 26 | Result / Stage 2 allocation | **External process** |
| 27 | Stage 1 retro | **External process** |
| 28 | Stage 2 mentor pairing | **External process** |
| 29 | Stage 2 client project deep-dive | **External dependency** |
| 30 | First Stage 2 sprint ticket | **External dependency** |

## Implemented coding set

- Day 2 separate React + Node TODO/Kanban app with keyboard command palette.
- Day 3 prompt library with ten reusable templates plus selection matrix.
- Day 4 LLM comparison report with weighted task scorecard.
- Day 5 Student CRUD — React + Node + PostgreSQL, plus search/filter and CSV export.
- Days 6–9 provider CLI, provider switching, streaming, retries, telemetry, 50-prompt benchmark, codebase explainer.
- Days 10–12 document Q&A, chunking, embeddings adapter, local vector retrieval, RAG answer generation, comparison report.
- Day 13 tool-using agent.
- Day 14 pure-SDK agent architecture and framework comparison.
- Day 15 standup-assistant real-use-case agent design and tool implementation.
- Day 19 GitHub Actions CI, Render configuration, and release preflight.
- Repository-wide navigation and execution runbook.

## Unique engineering additions

- Day 2: keyboard-first command palette (`Ctrl/⌘+K`, `D/B/N/P`).
- Day 3: prompt selection matrix.
- Day 4: weighted 100-point model-selection scorecard.
- Day 5: search/filter + CSV export.
- Days 6–15: offline `mock` provider for zero-key CLI/streaming smoke checks.
- Day 19: release preflight smoke gate in CI.

## Verification boundary

The repository contains exact local commands and health checks for runnable projects. Live provider/API verification is conditional on valid credentials. PostgreSQL CRUD verification requires a local PostgreSQL instance. Render deployment verification requires an actual connected Render/GitHub environment.

## Requires external/company state and is intentionally not fabricated

- Slack/cohort feedback and senior review
- Assigned real client repository work (Days 16–18)
- Real client capstone scope/repository and client feedback (Days 20–24)
- Stage assessment/results and Stage 2 work (Days 25–30)
- Live provider calls where API/billing access has not been provided
