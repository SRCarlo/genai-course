# Day 98 — PostgreSQL + pgvector RAG

## Core Concepts

- PostgreSQL
- pgvector
- Embeddings
- Vector dimensions
- Similarity search
- Cosine distance
- Metadata filtering
- Tenant isolation
- Repository pattern
- Document lifecycle
- Async ingestion
- Queue
- Worker
- Idempotency
- Re-indexing
- Retry
- Dead-letter handling
- Vector indexes
- RAG observability

## Important architecture

Document:
UPLOAD -> DB record -> QUEUE -> WORKER -> CLEAN -> CHUNK -> EMBED -> PGVECTOR -> READY

Chat:
USER -> AUTH -> QUERY EMBED -> TENANT FILTER -> VECTOR SEARCH -> TOP-K -> CONTEXT -> GROQ LLM -> ANSWER + SOURCES

## Groq change

This project uses Groq for generation:

- GROQ_MODEL=openai/gpt-oss-20b

Embeddings are intentionally local using:

- Xenova/all-MiniLM-L6-v2
- 384 dimensions

This avoids incorrectly treating a Groq chat model as an embedding model.

## Security

Every document and vector query is scoped by tenant_id.

SQL uses parameters instead of string interpolation.
