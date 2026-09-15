# Groovy Web — AI-First Engineer Journey

> **READ THIS FIRST.** This repository is the navigation hub for the 30-Day AI-First Engineer onboarding work.

## Submission links

### Live Vercel demo hub

**https://groovy-ai-nt6sdrqyr-kishan11.vercel.app**

The submission hub contains:

- **Mini-Project 1 — Student Management CRUD**: `/mini-project-1/`
- **Mini-Project 2 — Smart Doc Q&A**: `/mini-project-2/` with PDF page extraction, page-aware retrieval, and `[p.X c.Y]` citations.
- **Mini-Project 3 — Custom Agent**: `/mini-project-3/` with real server-side tool calling plus Supabase/Slack persistence hooks.
- **AI smoke console**: provider health, chat, streaming, agent execution, and framework comparison.

## End-to-end AI capability matrix

| Capability | Current implementation |
|---|---|
| Provider routing | Auto + Anthropic + OpenAI + Gemini + Groq, with graceful fallback to the first configured provider |
| Streaming | SSE streaming for all configured compatible providers |
| RAG | Page-aware chunking, OpenAI `text-embedding-3-small` when configured, deterministic embedding fallback, top-k retrieval, page/chunk citations |
| Agent tools | Calculator + public URL lookup + persistence tool loop, max-step safety boundary |
| Persistence | Supabase REST integration when configured; Slack webhook fallback; safe local-run fallback when neither is present |
| Day 14 | Pure SDK agent plus executable LangChain `create_agent` and LlamaIndex.TS `ReActAgent` implementations |
| Verification UI | Live smoke-test console under the Vercel root page |

### Environment variables for live provider behavior

Keep all secrets in Vercel environment variables or another secret manager. At minimum, configure `GROQ_API_KEY` for a fast default live provider. Other providers require their own credentials when explicitly selected.

Optional agent persistence variables:

```text
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_NOTES_TABLE
SLACK_WEBHOOK_URL
```

Optional models:

```text
GROQ_MODEL
OPENAI_MODEL
ANTHROPIC_MODEL
GEMINI_MODEL
OPENAI_EMBEDDING_MODEL
```

## Repository map

| Area | Purpose | Run / open |
|---|---|---|
| [`day-01/hello-ai`](./day-01/hello-ai/README.md) | Day 1 Hello AI prompt + evidence | Documentation/evidence |
| [`day-02 TODO app`](https://github.com/kishan-sip-it/groovy-day-02-todo-app) | React + Node TODO/Kanban application | See repo README |
| [`day-03/prompt-library.md`](./day-03/prompt-library.md) | 10 reusable prompt-engineering templates + selection matrix | Documentation |
| [`coding/README.md`](./coding/README.md) | Coding-work index for Days 4–19 | Start here |
| [`coding/day-05/student-crud`](./coding/day-05/student-crud/README.md) | React + Node + PostgreSQL CRUD + search/export | See project README |
| [`coding/days-06-15-ai-lab`](./coding/days-06-15-ai-lab/README.md) | Multi-provider CLI, streaming, RAG, agents + mock mode | See project README |
| [`coding/day-04/llm-comparison.md`](./coding/day-04/llm-comparison.md) | LLM comparison report + weighted scorecard | Documentation |
| [`coding/day-12/chunking-comparison.md`](./coding/day-12/chunking-comparison.md) | Chunking/retrieval report | Documentation |
| [`coding/day-14/agent-comparison.md`](./coding/day-14/agent-comparison.md) | Pure SDK vs LangChain vs LlamaIndex implementation | Documentation + runnable scripts |
| [`coding/day-15/standup-agent.md`](./coding/day-15/standup-agent.md) | Real-use-case agent specification | Implementation lives in AI lab |
| [`coding/day-19`](./coding/day-19) | CI/CD + release preflight | See project README |
| [`CODING_STATUS.md`](./CODING_STATUS.md) | Evidence matrix for Days 1–30 | Verification boundary |

## Fast execution index

### Days 6–15 — AI Lab

```bash
cd coding/days-06-15-ai-lab
npm install
cp .env.example .env
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

### Day 14 — framework implementations

```bash
cd coding/day-14
npm install
npm run langchain -- "Calculate 17*23 and explain the result."
npm run llamaindex -- "Calculate 17*23 and explain the result."
```

### Day 19 — CI/CD configuration

```bash
cd coding/day-19
node smoke-check.mjs
```

## Submission rule

All repository/code tasks that can be completed without company-controlled state should be represented with working code, documentation, or a runnable demo. Items that require senior review, a real Groovy/client repository, leadership judgment, cohort access, or formal assessment remain explicitly unclaimed.

API keys stay in environment variables or a secret manager. Never commit secrets to GitHub, README files, screenshots, or chat.
