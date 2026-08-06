# Advanced RAG Architecture

```text
                 User
                   │
                   ▼
        Query Transformation
                   │
                   ▼
             Hybrid Search
          ┌────────┴────────┐
          ▼                 ▼
    Vector Search      Keyword Search
          │                 │
          └────────┬────────┘
                   ▼
             Merge Results
                   ▼
               Reranker
                   ▼
          Context Builder
                   ▼
              Prompt Builder
                   ▼
                 Ollama
                   ▼
                Final Answer
```

## Components

- Query Transformation
- Hybrid Retrieval
- Reranking
- Context Builder
- Ollama
- Source Tracking
- Evaluation
