<!-- READ THIS FIRST: this is a report-only deliverable. Use ../../README.md and ../../RUNBOOK.md for repository navigation and execution. -->

# Day 4 — LLM Comparison Report

## Evaluation protocol

Use the same five prompts across Claude, ChatGPT/OpenAI, and Gemini. Record correctness, usefulness, latency, structure adherence, and failure mode. Do not declare a universal winner; choose by task.

| Prompt | Claude | OpenAI | Gemini |
|---|---|---|---|
| Explain an unfamiliar codebase | | | |
| Fix a verified runtime error | | | |
| Design an API endpoint | | | |
| Refactor a function safely | | | |
| Produce structured JSON | | | |

## Decision rule

- Highest correctness/reliability for the task wins.
- Prefer lower latency when quality is comparable.
- Prefer lower cost when quality and reliability are comparable.
- Prefer the provider whose tooling and structured-output behavior fit the application.

The executable multi-provider client for Days 6–9 is in `../days-06-15-ai-lab`.

## Execution

This file itself is documentation-only. The executable comparison path is the AI lab benchmark:

```bash
cd ../days-06-15-ai-lab
npm install
npm run bench
```

## Day 4 enhancement — Weighted decision scorecard

Use a 100-point task score instead of choosing a model by reputation alone:

| Criterion | Weight | Score range |
|---|---:|---:|
| Correctness / reliability | 40 | 0–40 |
| Usefulness / completeness | 25 | 0–25 |
| Structure / format adherence | 15 | 0–15 |
| Latency | 10 | 0–10 |
| Cost / efficiency | 10 | 0–10 |

For each prompt, record a score for each provider and write one evidence sentence. The winning model is the highest **task-specific** weighted score, not a universal winner.

### Comparison hygiene

Record the exact prompt, model name, timestamp, and whether tools or external context were enabled. This makes the comparison reproducible rather than anecdotal.
