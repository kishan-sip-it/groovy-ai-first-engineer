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

The executable multi-provider client for Days 6–9 is in `coding/days-06-15-ai-lab`.
