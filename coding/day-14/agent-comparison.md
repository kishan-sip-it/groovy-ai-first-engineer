# Day 14 — Agent Implementations and Comparison

## Implementations

This day now contains three runnable paths over the same calculator/tool task:

1. **Pure SDK** — `../days-06-15-ai-lab/src/agent.js`: explicit model → tool call → tool result loop.
2. **LangChain** — `langchain-agent.mjs`: current LangChain `createAgent` harness with a real calculator tool.
3. **LlamaIndex.TS** — `llamaindex-agent.mjs`: LlamaIndex `ReActAgent` with a real `FunctionTool` calculator.

Install the Day 14 dependencies with `npm install` from this directory, then run:

```bash
npm run langchain -- "Calculate 17*23 and explain the result."
npm run llamaindex -- "Calculate 17*23 and explain the result."
```

The framework implementations require a live `OPENAI_API_KEY`. The hosted submission console also exposes executable framework-comparison paths through `/api/frameworks` so the deployed app remains usable when only one supported provider is configured.

## Comparison

| Version | Control | Abstraction | Best use |
|---|---|---|---|
| Pure SDK | Highest | Lowest | Learning/debugging/fine control |
| LangChain | Medium | High | Standardized model/tool composition |
| LlamaIndex | Medium | High | Retrieval/data-centric agents |

LangChain currently exposes a `create_agent` harness around model + tools + middleware, while LlamaIndex.TS focuses on context engineering, retrieval, agents and workflows. Both support tool-using agent loops. citeturn104440view0turn104440view1

## Memory model

Short-term memory is the current conversation/tool state. Long-term memory is explicit persistent storage through the Day 15 agent persistence hooks; the model context window is not treated as durable memory.

## Verification target

The shared smoke task is deterministic at the tool layer: `17*23` must resolve to `391`. Live model output can then be compared across the three implementations without hard-coding API keys into the repository.
