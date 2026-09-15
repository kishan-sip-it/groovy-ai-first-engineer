<!-- READ THIS FIRST: report-only deliverable. Use ../../README.md and ../../RUNBOOK.md for navigation and runtime commands. -->

# Day 14 — Agent Implementations and Comparison

## Pure SDK

`../days-06-15-ai-lab/src/agent.js` implements an explicit tool loop: model proposes a tool call, the application executes/authorizes the tool, then the result is returned to the model.

## Framework comparison

| Version | Control | Abstraction | Best use |
|---|---|---|---|
| Pure SDK | Highest | Lowest | Learning/debugging/fine control |
| LangChain | Medium | High | Standardized model/tool composition |
| LlamaIndex | Medium | High | Retrieval/data-centric agents |

## Memory model

Short-term memory should be the current conversation/tool state. Long-term memory should be explicit persistent storage; do not implicitly treat the model context window as durable memory.

## Execution

This file is documentation-only. Exercise the pure tool loop with:

```bash
cd ../days-06-15-ai-lab
npm install
npm run agent -- "Calculate 17*23 and save the result as a note"
```
