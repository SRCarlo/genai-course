# Day 64 — LLM Evaluation & RAG/Agent Testing

## Goal

Build an automated evaluation framework
for the Day 63 Agentic RAG application.

The evaluation system measures:

- Retrieval precision
- Retrieval recall
- Top-K retrieval
- Answer correctness
- Answer relevance
- Answer faithfulness
- Agent tool selection
- Agent trajectory
- Tool efficiency
- Latency
- Token usage

---

# Architecture

```text
                 GOLDEN DATASET
                       |
                       v
                DAY 63 AI SYSTEM
                       |
          +------------+------------+
          |            |            |
          v            v            v
      Retrieval      Answer       Agent
      Evaluation    Evaluation   Evaluation
          |            |            |
          +------------+------------+
                       |
                       v
                    METRICS
                       |
                       v
                  QUALITY GATE
                       |
                 +-----+-----+
                 |           |
                PASS        FAIL
                 |           |
                 v           v
              DEPLOY      IMPROVE
```
