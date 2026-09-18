# Day 97 — Production RAG Application

A production-oriented RAG backend built with:

- Node.js
- Express
- Zod
- Groq API
- openai/gpt-oss-20b

## Architecture

```
Client
↓
Express API
↓
Authentication
↓
Application Service
↓
RAG Service
↓
Embedding Service
↓
Vector Repository
↓
Context Builder
↓
Groq LLM
↓
Answer + Sources
```

## Endpoints

### Health

GET /health

### Documents

POST /api/documents

Headers:
`x-tenant-id
x-user-id`


Body:

```
{
"name": "refund-policy.txt",
"content": "..."
}
```

### Chat

POST /api/chat

Headers:
`x-tenant-id
x-user-id`

Body:

```
{
"question": "What is the refund period?"
}
```

## Environment

Create `.env`:

```
PORT=3000
GROQ_API_KEY=your_key
LLM_MODEL=openai/gpt-oss-20b
EMBEDDING_MODEL=fake-embedding-model
TOP_K=5
SIMILARITY_THRESHOLD=0.1
```

## Run

```
npm install

npm run dev
```
