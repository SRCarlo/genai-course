# Day 98 — Production RAG with PostgreSQL + pgvector + Groq

Complete Day 98 implementation based on the supplied course material.

## No Docker

This version does **not** use Docker or Docker Compose. PostgreSQL runs directly on your Windows machine.

## Stack

- Node.js
- Express
- Local PostgreSQL
- pgvector
- Groq API
- `openai/gpt-oss-20b` for generation
- `Xenova/all-MiniLM-L6-v2` for local embeddings
- Zod
- In-memory queue for learning

## 1. Install PostgreSQL and pgvector

Install PostgreSQL locally, then create the database:

```sql
CREATE DATABASE genai_rag;
```

Connect to it:

```sql
\c genai_rag
```

Enable pgvector:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

Verify:

```sql
SELECT extname FROM pg_extension WHERE extname = 'vector';
```

## 2. Install Node dependencies

```powershell
npm install
```

## 3. Create `.env`

Copy `.env.example` to `.env` and set your PostgreSQL password and Groq key:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/genai_rag
GROQ_API_KEY=YOUR_GROQ_API_KEY
GROQ_MODEL=openai/gpt-oss-20b
EMBEDDING_MODEL=Xenova/all-MiniLM-L6-v2
EMBEDDING_DIMENSION=384
TOP_K=5
MAX_DISTANCE=0.75
MAX_RETRIES=3
```

Do not commit `.env`.

## 4. Run migration

```powershell
npm run db:migrate
```

Expected:

```text
Migration completed.
```

## 5. Start the API

```powershell
npm run dev
```

The API runs at:

```text
http://localhost:5000
```

## 6. Health check

Open:

```text
http://localhost:5000/api/health
```

## 7. Create a document

PowerShell:

```powershell
$headers = @{
  "Content-Type" = "application/json"
  "x-tenant-id" = "11111111-1111-1111-1111-111111111111"
}

$body = @{
  name = "refund-policy.txt"
  mimeType = "text/plain"
  content = "Our refund policy allows customers to request a refund within thirty days of purchase. Refund requests must include the order number."
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "http://localhost:5000/api/documents" `
  -Method POST `
  -Headers $headers `
  -Body $body
```

The document lifecycle is:

```text
UPLOADED -> PROCESSING -> READY
```

## 8. RAG chat

```powershell
$headers = @{
  "Content-Type" = "application/json"
  "x-tenant-id" = "11111111-1111-1111-1111-111111111111"
}

$body = @{
  question = "What is the refund policy?"
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "http://localhost:5000/api/chat" `
  -Method POST `
  -Headers $headers `
  -Body $body
```

Flow:

```text
Question
  -> Embedding
  -> PostgreSQL + pgvector
  -> tenant filter
  -> Top-K
  -> Context
  -> Groq openai/gpt-oss-20b
  -> Answer + Sources
```

## 9. Tenant isolation

Every document and vector search is scoped by `tenant_id`.

The vector repository uses a parameterized filter:

```sql
WHERE tenant_id = $2
```

Tenant B therefore cannot retrieve Tenant A's chunks.

## 10. Tests

```powershell
npm test
```

## 11. Important files

- `src/infrastructure/database/db.js` — PostgreSQL connection
- `src/infrastructure/database/migrations/001_initial.sql` — pgvector schema
- `src/infrastructure/repositories/document.repository.js` — document persistence
- `src/infrastructure/repositories/vector.repository.js` — vector persistence and search
- `src/ai/embeddings/embedding.service.js` — local embeddings
- `src/ai/llm/llm.service.js` — Groq `openai/gpt-oss-20b`
- `src/ai/rag/rag.service.js` — RAG orchestration
- `src/ingestion/ingestion.worker.js` — async ingestion worker

## 12. Why Groq and a separate embedding model?

`openai/gpt-oss-20b` is used for generation/reasoning through Groq. Embeddings are a separate responsibility, so this project uses `Xenova/all-MiniLM-L6-v2`, which produces 384-dimensional vectors. The PostgreSQL column is therefore `VECTOR(384)`.

## 13. Production improvements

For production, replace the practice `x-tenant-id` authentication, in-memory queue, simple text input, and basic retry mechanism with real authentication, a durable queue, file extraction, stronger observability, and evaluated retrieval/indexing strategies.
