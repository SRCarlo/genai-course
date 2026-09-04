# Day 83 — Vector Memory Agent

A Node.js implementation of semantic memory retrieval for AI agents.

## Architecture

```
User
↓
Express API
↓
Memory Agent
↓
Semantic Retriever
↓
Embedding Service
↓
Vector Memory Store
↓
Context Builder
↓
Groq
↓
openai/gpt-oss-20b
```

## Features

- Embeddings
- Vector memory
- Cosine similarity
- Semantic retrieval
- Top-K retrieval
- User isolation
- Metadata filtering
- Hybrid scoring
- Importance
- Recency
- Keyword matching
- Memory deduplication
- Memory validation
- Context construction
- Memory extraction
- Groq LLM integration

## Install

npm install

## Environment

Create `.env`:

```
GROQ_API_KEY=your_key
GROQ_MODEL=openai/gpt-oss-20b
PORT=3000
```

## Run

```
npm start
```

## Development

```
npm run dev
```

## Tests

```
npm test
```

## Chat endpoint

POST /api/chat

Example:

```
{
"userId": "user123",
"message": "I prefer Node.js for backend development."
}
```

## Important

The included embedding service is a deterministic educational implementation.

It is not a production semantic embedding model.

Replace it with a real embedding model before deploying this system to production.

The vector store is also an in-memory implementation.

Production systems should use persistent storage and a real vector search engine.
