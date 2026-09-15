<!-- READ THIS FIRST: root navigation is ../../../README.md and exact execution commands are in ../../../RUNBOOK.md. -->

# Days 6–15 AI Lab

## Setup / Run

From this directory:

```bash
cp .env.example .env
npm install
```

Add API keys only to local `.env`; never commit them.

### Commands

```bash
npm run chat -- --provider anthropic "Explain RAG in 3 points"
npm run chat -- --provider openai "Explain REST in 3 points"
npm run chat -- --provider gemini "Explain embeddings in 3 points"
npm run stream -- --provider anthropic "Explain streaming in 5 lines"
npm run explain -- .
npm run agent -- "Calculate 17*23 and save the result as a note"
npm run rag -- "What is the main idea?" --file ./sample.txt
npm run bench
```

### Verify

- `chat`: direct completion through one selected provider.
- `stream`: streaming output through one selected provider.
- `explain`: codebase explanation path.
- `agent`: calculator / web-fetch / save-note tool path.
- `rag`: document ingestion and source-aware retrieval path.
- `bench`: multi-provider benchmark path.

### Checklist mapping

- Day 6: Anthropic Messages API, Node CLI, Python SDK example, multi-turn-ready CLI structure.
- Day 7: provider switch and 50-prompt benchmark output.
- Day 8: streaming + exponential backoff/retry.
- Day 9: telemetry CSV + codebase explainer.
- Days 10–11: document ingestion, chunk retrieval, embeddings adapter, RAG answers with source chunks.
- Day 12: four-strategy chunking comparison report.
- Day 13: calculator/web-fetch/save-note tool agent.
- Day 14: pure SDK agent architecture and framework comparison.
- Day 15: standup-assistant real-use-case definition.

For the full execution map, use [`../../../RUNBOOK.md`](../../../RUNBOOK.md).
