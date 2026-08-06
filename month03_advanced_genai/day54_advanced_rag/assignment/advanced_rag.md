# Day 54 Assignment — Advanced RAG

## Objective

Build an advanced Retrieval-Augmented Generation (RAG) pipeline that combines semantic search, keyword search, reranking, query transformation, and a local LLM using Ollama.

---

# Task 1 — Create a Knowledge Base

Create a minimum of **10 documents** inside:

```
data/documents/
```

Example topics:

- Express
- Node.js
- MongoDB
- React
- JWT
- Authentication
- Authorization
- Middleware
- Routing
- REST API

---

# Task 2 — Add Metadata

Each indexed document should include metadata.

Example:

```json
{
  "id": 1,
  "text": "Express middleware functions...",
  "source": "express.md",
  "category": "backend",
  "framework": "express",
  "language": "javascript"
}
```

Metadata should support:

- Filtering
- Source Tracking
- Evaluation
- Debugging

---

# Task 3 — Implement Semantic Retrieval

Create:

```
server/services/vectorSearchService.js
```

Responsibilities:

- Generate embeddings (or simulated vectors)
- Compute similarity
- Return Top-K relevant documents

Expected Flow:

```
Query
   │
   ▼
Embedding
   │
   ▼
Vector Search
   │
   ▼
Top Documents
```

---

# Task 4 — Implement Keyword Retrieval

Create:

```
server/services/keywordSearchService.js
```

Responsibilities:

- Tokenize query
- Match keywords
- Rank documents

This represents lexical retrieval similar to BM25.

---

# Task 5 — Build Hybrid Search

Create:

```
server/services/hybridSearchService.js
```

Combine:

- Vector Search
- Keyword Search

Merge results into a single ranked list.

Pipeline:

```
           Query
             │
      ┌──────┴──────┐
      ▼             ▼
Vector Search   Keyword Search
      │             │
      └──────┬──────┘
             ▼
       Hybrid Results
```

---

# Task 6 — Add Reranking

Create:

```
server/services/rerankerService.js
```

Responsibilities:

- Accept retrieved candidates
- Compute improved relevance
- Return Top-3 documents

Pipeline:

```
Hybrid Search
      │
      ▼
20 Candidates
      │
      ▼
 Reranker
      │
      ▼
 Top Documents
```

---

# Task 7 — Query Transformation

Create:

```
server/services/queryTransformService.js
```

Improve user queries before retrieval.

Example:

Original:

```
auth in express
```

Transformed:

```
express authentication authorization middleware
```

---

# Task 8 — Context Builder

Create:

```
server/services/contextBuilder.js
```

Responsibilities:

- Merge retrieved chunks
- Preserve source names
- Build prompt context

Example:

```
SOURCE 1
File: express.md

...

SOURCE 2
File: middleware.md

...
```

---

# Task 9 — Connect Ollama

Create:

```
server/services/ollamaService.js
```

Responsibilities:

- Send prompt to Ollama
- Receive generated answer
- Return response

Example `.env`:

```env
PORT=5000
OLLAMA_URL=http://localhost:11434
MODEL=llama3.2:3b
```

---

# Task 10 — Build the API

Create:

```
POST /api/rag/ask
```

Request:

```json
{
  "question": "What is Express middleware?"
}
```

Example Response:

```json
{
  "question": "What is Express middleware?",
  "transformedQuery": "express middleware request response next",
  "answer": "...",
  "sources": [
    {
      "file": "express.md",
      "score": 12.5
    },
    {
      "file": "middleware.md",
      "score": 10.8
    }
  ]
}
```

---

# Task 11 — Evaluate Retrieval

Create:

```
evaluation/retrieval_results.md
```

Include at least **10 evaluation queries**.

| Query               | Expected Source | Retrieved Source | Top-K | Relevant | Latency |
| ------------------- | --------------- | ---------------- | ----- | -------- | ------- |
| What is middleware? | express.md      | express.md       | 3     | ✅       | 180 ms  |
| What is JWT?        | jwt.md          | jwt.md           | 3     | ✅       | 175 ms  |
| What is MongoDB?    | mongodb.md      | mongodb.md       | 3     | ✅       | 170 ms  |
| ...                 | ...             | ...              | ...   | ...      | ...     |

---

# Task 12 — Test the Pipeline

Verify:

- Query transformation works
- Hybrid search retrieves relevant documents
- Reranker improves ranking
- Context is built correctly
- Ollama answers using only the provided context
- Sources are returned with each answer

---

# Expected Architecture

```
                    User
                      │
                      ▼
            Query Transformation
                      │
                      ▼
               Hybrid Search
           ┌──────────┴──────────┐
           ▼                     ▼
     Vector Search         Keyword Search
           │                     │
           └──────────┬──────────┘
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

---

# Learning Outcomes

After completing this assignment, you should be able to:

- Explain semantic search
- Explain keyword search
- Describe BM25 and lexical retrieval
- Implement hybrid search
- Apply reranking
- Transform search queries
- Build context for LLMs
- Integrate a local LLM using Ollama
- Track sources in responses
- Evaluate retrieval quality using Top-K metrics

---

# Submission Checklist

- [ ] Created 10 knowledge-base documents
- [ ] Added document metadata
- [ ] Implemented vector retrieval
- [ ] Implemented keyword retrieval
- [ ] Combined into hybrid search
- [ ] Added reranking
- [ ] Added query transformation
- [ ] Built context builder
- [ ] Integrated Ollama
- [ ] Implemented `/api/rag/ask`
- [ ] Created retrieval evaluation
- [ ] Documented architecture
- [ ] Tested end-to-end pipeline
- [ ] Committed changes to Git
