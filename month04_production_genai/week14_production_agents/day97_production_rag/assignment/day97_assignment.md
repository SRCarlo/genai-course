# Day 97 Assignment

## Level 1

Build a Production RAG foundation.

### Requirements

- Express server
- GET /health
- POST /api/chat
- POST /api/documents
- document ingestion
- text cleaning
- chunking
- fake embedding service
- fake vector repository
- retrieval
- context builder
- Groq LLM
- openai/gpt-oss-20b
- source attribution
- Zod validation
- authentication boundary
- tenant filtering
- error handling

---

# Level 2

Implement:

## Document API

POST /api/documents

## Chat API

POST /api/chat

## Retrieval

```
Question
↓
Embedding
↓
Vector Search
↓
Top-K
↓
Threshold
↓
Context
↓
Groq LLM
```

## Response

```
{
"answer": "...",
"sources": []
}
```

---

# Level 3

Production improvements:

- PostgreSQL
- pgvector
- object storage
- queue
- worker
- Redis
- authentication
- authorization
- rate limiting
- observability
- tracing
- RAG evaluation
- guardrails
- prompt injection defense
- output validation
- source validation
- retries
- timeout
- fallback
- request IDs
