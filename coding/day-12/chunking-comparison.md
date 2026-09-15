# Day 12 — Chunking Comparison

The local RAG implementation uses overlapping word-window chunks by default. The comparison framework below covers the four strategies required by the checklist.

| Strategy | Strength | Weakness | Best fit | Measure |
|---|---|---|---|---|
| Fixed-size | Simple and predictable | Can split ideas | General docs | top-k recall |
| Semantic | Preserves meaning | More compute/complexity | Topic-rich docs | answer relevance |
| Sliding window | Strong local context | More chunks/tokens | Context-sensitive text | retrieval recall |
| Hierarchical | Preserves document structure | More implementation work | Large structured docs | section + chunk precision |

## Retrieval evaluation

Run the same question set against each strategy and record:

- hit@k / whether a gold chunk is retrieved
- answer relevance
- citation correctness
- latency
- token/embedding cost

The Day 10–11 baseline is in `coding/days-06-15-ai-lab/src/rag.js`.
