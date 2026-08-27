# Day 75 — Advanced RAG

Production-oriented RAG learning project.

## Stack

- Node.js
- Express
- Groq
- openai/gpt-oss-20b
- Local TF-IDF vector retrieval
- Keyword retrieval
- Reciprocal Rank Fusion
- LLM reranking
- Query rewriting
- Query expansion
- Context compression

## Architecture

User Query
↓
Query Rewriter
↓
Hybrid Search
↓
Vector Search + Keyword Search
↓
RRF Fusion
↓
Candidate Documents
↓
Reranker
↓
Top Documents
↓
Context Compression
↓
Context Budget
↓
Groq LLM
↓
Answer + Sources + Trace

## Setup

Install dependencies:

npm install

Create .env:

GROQ_API_KEY=your_key

GROQ_MODEL=openai/gpt-oss-20b

## Start

npm run dev

## Production start

npm start

## Health check

GET /health

## RAG query

POST /api/rag/query

Example:

{
"query": "What is HTTP 429?",
"topK": 10,
"finalK": 5,
"metadataFilter": {
"tenantId": "tenant_1"
}
}

## Query expansion

{
"query": "How can I improve Node performance?",
"useQueryExpansion": true
}

## Evaluation

npm run evaluate

## Tests

npm test
