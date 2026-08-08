# DAY 56 — Production RAG Capstone

## Project

AI Knowledge Base Assistant

## Objective

Build a production-oriented Retrieval-Augmented Generation
application by combining the advanced RAG concepts from Day 54
with the evaluation and monitoring concepts from Day 55.

---

# Architecture

The final architecture is:

User
↓
Next.js Frontend
↓
Express API
↓
Request ID
↓
Query Processing
↓
Cache Check
↓
Hybrid Retrieval
├── Vector Search
└── Keyword Search
↓
Result Fusion
↓
Reranking
↓
Context Selection
↓
LLM / Ollama
↓
Answer + Sources
↓
Evaluation / Metrics / Logging

---

# Frontend

The frontend is implemented using Next.js.

Responsibilities:

- Question input
- Send question to backend
- Display loading state
- Display generated answer
- Display source documents
- Display errors
- Display retrieval and latency metadata

Frontend endpoint:

POST /api/chat

Backend URL:

http://localhost:5000

---

# Backend

The backend uses Express.

Main endpoints:

GET /health

POST /api/chat

The backend is separated into:

- Controllers
- Routes
- Services
- Middleware

This separation keeps HTTP handling separate from RAG
business logic.

---

# Services

The backend contains the following services:

- Query Service
- Embedding Service
- Vector Search Service
- Keyword Search Service
- Hybrid Search Service
- Reranker Service
- Context Service
- LLM Service
- Cache Service
- Evaluation Service

---

# Query Processing

The query is normalized before retrieval.

Example:

User query:

How does Express middleware work?

Normalized query:

How does Express middleware work?

---

# Retrieval

The application uses hybrid retrieval.

## Vector Search

Vector search uses embeddings to find semantically similar
documents.

Embedding model:

nomic-embed-text

---

## Keyword Search

Keyword retrieval is used for exact terms and lexical matching.

This is useful for:

- API names
- Error codes
- Function names
- Technical terminology
- Exact identifiers

---

# Hybrid Search

Vector and keyword retrieval are executed independently
and their results are combined.

The retrieval architecture is:

Query
↓
Vector Search

- Keyword Search
  ↓
  Result Fusion
  ↓
  Deduplication
  ↓
  Candidate Documents

Parallel retrieval can reduce latency because the two
retrieval operations can execute at the same time.

---

# Reranking

Initial retrieval produces candidate documents.

The reranker then evaluates candidate relevance more carefully.

Example:

20 retrieved candidates
↓
Reranker
↓
Top 5 candidates

Reranking helps improve the quality of the context sent
to the LLM.

---

# Context Engineering

Only the most relevant chunks are included in the final
LLM context.

The goal is to:

- Reduce irrelevant information
- Reduce token usage
- Improve answer quality
- Reduce hallucination
- Reduce LLM latency

---

# LLM

The project uses a local LLM through Ollama.

Model:

llama3.2:3b

Ollama endpoint:

http://localhost:11434

The LLM is instructed to answer using only the provided
context.

If the context does not contain enough information, the
assistant should clearly state that it does not have enough
information.

---

# Grounded Prompt

The system uses a grounded prompt based on the following
principle:

The assistant must answer using only retrieved context.

It must not invent technical details.

When sufficient context is unavailable, it should refuse
to guess.

---

# Source Attribution

The API returns source information together with the answer.

Example:

{
"answer": "...",
"sources": [
{
"source": "express.md"
}
]
}

Source attribution improves:

- Transparency
- Debugging
- User trust
- Evaluation
- Retrieval analysis

---

# Request IDs

Every API request receives a unique request ID.

Example:

X-Request-ID:
abc-123

The request ID allows the complete request lifecycle to be
traced.

Example:

Request
↓
Query
↓
Retrieval
↓
Reranking
↓
Context
↓
LLM
↓
Response

---

# Latency Monitoring

The system measures:

- Query processing latency
- Vector search latency
- Keyword search latency
- Reranking latency
- LLM latency
- Total latency

Example:

query: 2 ms
vector: 35 ms
keyword: 20 ms
reranking: 120 ms
llm: 950 ms
total: 1127 ms

Actual measurements should be recorded in the evaluation
report.

---

# Caching

A cache is used to avoid repeating expensive operations
for identical normalized questions.

Flow:

Question
↓
Normalize
↓
Cache Check

Cache HIT:
Return cached answer

Cache MISS:
Run RAG pipeline
↓
Store result in cache
↓
Return answer

For learning, an in-memory Map can be used.

For production, a shared cache such as Redis can be used.

---

# Evaluation

The project contains an evaluation dataset with at least
10 questions.

The evaluation measures retrieval quality and performance.

Metrics include:

- Hit@5
- Recall@5
- MRR
- Latency
- Cache hit rate
- Answer quality
- Context quality

---

# Hit@5

Hit@5 measures whether at least one relevant source was
retrieved within the top five results.

---

# Recall@5

Recall@5 measures how many of the relevant documents or
chunks were retrieved within the top five results.

---

# MRR

Mean Reciprocal Rank measures how high the first relevant
result appears in the ranking.

Higher MRR means relevant results generally appear earlier.

---

# Error Handling

The system handles:

- Empty questions
- Invalid requests
- Retrieval failures
- LLM failures
- Unknown questions
- Backend errors

Unknown questions should not cause the LLM to invent an
answer.

---

# Unknown Questions

Example:

What is quantum computing?

If quantum computing is not present in the knowledge base,
the assistant should respond that there is not enough
information in the knowledge base.

---

# Production Principles

1. Separate controllers and services.
2. Never hard-code API keys.
3. Store secrets in environment variables.
4. Use request IDs.
5. Log safely.
6. Measure latency.
7. Return source information.
8. Evaluate retrieval independently from generation.
9. Keep context focused.
10. Use caching where appropriate.
11. Handle errors explicitly.
12. Do not hallucinate when context is missing.
13. Measure before optimizing.
14. Use parallel retrieval where possible.

---

# Main Lesson

A production RAG application is not simply:

LLM + Vector Database

A production-oriented RAG system combines:

Retrieval

- Hybrid Search
- Reranking
- Context Engineering
- LLM
- Source Attribution
- Evaluation
- Caching
- Monitoring
- Error Handling
- Performance Optimization

  ***

# Week 8 Milestone

Day 54:
Advanced RAG

Day 55:
RAG Evaluation

Day 56:
Production-oriented RAG

The progression is:

Basic RAG
↓
Advanced RAG
↓
Evaluated RAG
↓
Production-oriented RAG
