<!-- READ THIS FIRST: this specification is linked to the executable agent in ../days-06-15-ai-lab. See ../../README.md and ../../RUNBOOK.md for navigation and execution. -->

# Day 15 — Real-Use-Case Agent

## Use case
Standup assistant: turn raw team updates into a concise structured standup summary.

## Inputs
- yesterday
- today
- blockers

## Tools
1. `save_note` writes the summary locally.
2. `calculator` can compute simple sprint metrics.
3. `web_search` can retrieve a URL supplied by the user when external context is explicitly needed.

## Guardrails
- Never invent blockers or accomplishments.
- Keep source wording traceable.
- Human reviews before anything is sent externally.

The pure tool loop is implemented in `../days-06-15-ai-lab/src/agent.js`.

## Execution

```bash
cd ../days-06-15-ai-lab
npm install
npm run agent -- "Summarize these updates: yesterday fixed login; today finish tests; blockers none"
```
