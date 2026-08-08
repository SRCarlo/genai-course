# Day 56 — Production RAG Capstone

## AI Knowledge Base Assistant

A production-oriented Retrieval-Augmented Generation (RAG) application built as the final project for Week 8 — Advanced Generative AI.

This project combines the concepts learned throughout Days 54 and 55:

- Hybrid Search
- Vector Search
- Keyword Search / BM25
- Reranking
- Context Engineering
- Metadata
- Source Attribution
- Query Processing
- Caching
- RAG Evaluation
- Latency Monitoring
- Request IDs
- Error Handling
- Next.js Frontend
- Express Backend
- Local LLM with Ollama

---

# Project Overview

The AI Knowledge Base Assistant allows users to ask technical questions about a predefined knowledge base.

Example:

```text
User:
How does Express middleware work?
```

The system retrieves relevant information from the knowledge base and generates a grounded answer.

```text
User
 ↓
Next.js Frontend
 ↓
Express API
 ↓
Query Processing
 ↓
Cache Check
 ↓
Hybrid Retrieval
 ├── Vector Search
 └── Keyword Search / BM25
 ↓
Result Fusion
 ↓
Reranking
 ↓
Context Selection
 ↓
Ollama LLM
 ↓
Answer + Sources
 ↓
Evaluation / Metrics
```

The goal is not simply to connect an LLM to a vector database.

The goal is to build a complete RAG application with retrieval, ranking, context management, evaluation, monitoring, and error handling.

---

# Day 56 Objectives

By completing this project, the following concepts are demonstrated:

1. Production-oriented RAG architecture
2. Modular Express backend
3. Query normalization
4. Embedding generation
5. Vector retrieval
6. Keyword retrieval
7. Hybrid retrieval
8. Reranking
9. Context construction
10. Grounded LLM generation
11. Source attribution
12. Request ID tracking
13. Latency measurement
14. Response caching
15. RAG evaluation
16. Next.js frontend integration
17. Error handling
18. Production-oriented project structure

---

# Architecture

```text
                    ┌──────────────┐
                    │     USER     │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   Next.js    │
                    │   Frontend   │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Express API  │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Request ID   │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Query Service│
                    └──────┬───────┘
                           │
                           ▼
                     Cache Check
                       /     \
                     HIT     MISS
                      │        │
                      │        ▼
                      │   Hybrid Search
                      │      /     \
                      │     ▼       ▼
                      │  Vector    Keyword
                      │  Search    Search
                      │     \       /
                      │      \     /
                      │       ▼   ▼
                      │      Fusion
                      │        │
                      │        ▼
                      │     Reranking
                      │        │
                      │        ▼
                      │ Context Selection
                      │        │
                      │        ▼
                      │      Ollama
                      │        │
                      │        ▼
                      │      Cache
                      │        │
                      └────────┤
                               ▼
                       Answer + Sources
                               │
                               ▼
                         Next.js UI
```

---

# Project Structure

```text
day56_production_rag/
│
├── backend/
│   │
│   ├── controllers/
│   │   └── chatController.js
│   │
│   ├── routes/
│   │   └── chatRoutes.js
│   │
│   ├── services/
│   │   ├── queryService.js
│   │   ├── embeddingService.js
│   │   ├── vectorSearchService.js
│   │   ├── keywordSearchService.js
│   │   ├── hybridSearchService.js
│   │   ├── rerankerService.js
│   │   ├── contextService.js
│   │   ├── llmService.js
│   │   ├── cacheService.js
│   │   └── evaluationService.js
│   │
│   ├── middleware/
│   │   └── requestId.js
│   │
│   └── server.js
│
├── frontend/
│   ├── app/
│   │   ├── layout.js
│   │   ├── page.js
│   │   └── globals.css
│   │
│   ├── package.json
│   └── README.md
│
├── data/
│   └── documents/
│       ├── express.md
│       ├── nodejs.md
│       ├── mongodb.md
│       ├── javascript.md
│       └── api.md
│
├── evaluation/
│   ├── questions.json
│   ├── results.json
│   └── report.md
│
├── scripts/
│   ├── ingest.js
│   └── evaluate.js
│
├── assignment/
│   └── production_rag.md
│
├── notes/
│   └── day56_notes.md
│
├── docs/
│   └── architecture.md
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

# RAG Pipeline

The main RAG pipeline is:

```text
User Question
      ↓
Normalize Query
      ↓
Cache Check
      ↓
Generate Query Embedding
      ↓
Vector Search
      +
Keyword Search
      ↓
Hybrid Retrieval
      ↓
Reranking
      ↓
Context Selection
      ↓
Grounded Prompt
      ↓
Ollama LLM
      ↓
Answer
      +
Sources
```

---

# Hybrid Retrieval

The project uses two retrieval strategies.

## Vector Search

Vector search retrieves documents based on semantic similarity.

```text
Question
   ↓
Embedding
   ↓
Vector Database
   ↓
Similar Chunks
```

This is useful when the query uses different words from the source document but has a similar meaning.

## Keyword Search

Keyword retrieval looks for exact or lexical matches.

Examples:

```text
EADDRINUSE
middleware
MongoDB
Express
Node.js
```

Keyword search is useful for technical terminology, identifiers, error codes, function names, and exact phrases.

## Hybrid Search

Both retrieval methods are executed and their results are combined.

```text
                 Query
                   │
          ┌────────┴────────┐
          ▼                 ▼
    Vector Search      Keyword Search
          │                 │
          └────────┬────────┘
                   ▼
             Result Fusion
                   │
                   ▼
               Reranking
```

Running independent retrieval operations in parallel can also reduce retrieval latency.

---

# Reranking

Initial retrieval is designed to retrieve candidates efficiently.

Example:

```text
Hybrid Search
     ↓
20 candidate documents
     ↓
Reranker
     ↓
Top 5 documents
```

The reranking stage improves the relevance of the context supplied to the LLM.

---

# Context Engineering

The selected documents are converted into a structured context.

Example:

```text
SOURCE 1
FILE: express.md

Express middleware functions are functions
that have access to the request object,
response object, and the next middleware
function...
```

The LLM receives this context along with the user's question.

---

# Grounded Generation

The LLM is instructed to answer using the retrieved context.

The system prompt follows this principle:

```text
You are a technical knowledge assistant.

Answer the user's question using only the
provided context.

If the context does not contain enough
information, clearly say that you do not
have enough information.

Do not invent technical details.
```

This helps reduce hallucination.

---

# Local LLM — Ollama

This project uses a local Ollama model.

Example:

```text
llama3.2:3b
```

The embedding model used for local embeddings:

```text
nomic-embed-text
```

Check installed models:

```powershell
ollama list
```

Start Ollama when required:

```powershell
ollama serve
```

If you see:

```text
Error: listen tcp 127.0.0.1:11434:
bind: Only one usage of each socket address
```

it usually means Ollama is already running on port `11434`.

In that case, you normally do not need to start another `ollama serve` process.

---

# Environment Variables

Create a `.env` file in the project root.

Example:

```env
PORT=5000

LLM_BASE_URL=http://localhost:11434

LLM_MODEL=llama3.2:3b

EMBEDDING_MODEL=nomic-embed-text

VECTOR_DB_URL=

VECTOR_DB_API_KEY=
```

Never commit the real `.env` file.

The repository should contain:

```text
.env.example
```

but not:

```text
.env
```

---

# Git Ignore

The `.gitignore` file should contain:

```gitignore
node_modules/
.env
.next/
```

---

# Backend Installation

From the project root:

```powershell
npm install
```

The backend dependencies include:

```text
express
cors
dotenv
axios
```

Development dependency:

```text
nodemon
```

---

# Run Backend

From:

```text
day56_production_rag/
```

run:

```powershell
npm run dev
```

Expected output:

```text
Server running on port 5000
```

---

# Health Check

Open:

```text
http://localhost:5000/health
```

Expected response:

```json
{
  "success": true,
  "message": "Production RAG API is running"
}
```

---

# Chat API

The main endpoint is:

```text
POST /api/chat
```

Request:

```json
{
  "question": "What is Express middleware?"
}
```

Expected response structure:

```json
{
  "success": true,
  "requestId": "abc-123",
  "answer": "Express middleware functions can access the request and response objects and participate in the request-response cycle.",
  "sources": [
    {
      "source": "express.md"
    }
  ],
  "metadata": {
    "retrievedDocuments": 5,
    "latencyMs": 840,
    "cacheHit": false
  }
}
```

---

# Frontend

The frontend is implemented using Next.js.

The frontend provides:

```text
┌─────────────────────────────────────┐
│       AI Knowledge Assistant        │
├─────────────────────────────────────┤
│                                     │
│ Ask your technical question...      │
│                                     │
│                         [ Send ]    │
│                                     │
├─────────────────────────────────────┤
│ Answer                              │
│                                     │
│ Express middleware...               │
│                                     │
│ Sources                             │
│ • express.md                        │
└─────────────────────────────────────┘
```

The frontend sends requests to:

```text
http://localhost:5000/api/chat
```

---

# Run Frontend

Open a second terminal.

Go to:

```powershell
cd frontend
```

Install dependencies:

```powershell
npm install
```

Start Next.js:

```powershell
npm run dev
```

The frontend will normally run at:

```text
http://localhost:3000
```

---

# Frontend to Backend

The frontend sends:

```javascript
const response = await fetch("http://localhost:5000/api/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    question,
  }),
});
```

Then:

```javascript
const data = await response.json();
```

The UI displays:

```text
Answer
+
Sources
+
Errors
+
Loading state
```

---

# Knowledge Base

The knowledge base contains technical documentation.

Example documents:

```text
data/documents/

express.md
nodejs.md
mongodb.md
javascript.md
api.md
```

The complete assignment should contain at least:

```text
10 documents
```

Each document should have useful metadata such as:

```json
{
  "source": "express.md",
  "category": "backend",
  "language": "javascript",
  "framework": "express"
}
```

---

# Ingestion Pipeline

Documents are processed before users query the system.

```text
Documents
    ↓
Read Files
    ↓
Chunk Documents
    ↓
Generate Embeddings
    ↓
Store Vectors
    ↓
Store Metadata
```

This is separated from the query pipeline.

The system should not regenerate embeddings for every user question.

---

# Query Pipeline

When a user asks a question:

```text
POST /api/chat
      ↓
Validate Question
      ↓
Normalize Query
      ↓
Cache Check
      ↓
Embedding
      ↓
Vector Search
      +
Keyword Search
      ↓
Hybrid Search
      ↓
Reranking
      ↓
Context Builder
      ↓
LLM
      ↓
Cache Response
      ↓
Answer + Sources
```

---

# Performance Monitoring

The application tracks latency for important stages.

Example:

```text
Request ID: abc123

Query:       2ms
Vector:     35ms
Keyword:    20ms
Reranking: 120ms
LLM:       950ms
-------------------
Total:    1127ms
```

The purpose is to identify the actual bottleneck before optimizing.

---

# Request ID

Each API request receives a unique request ID.

Example:

```text
abc123
```

The ID is also returned through:

```text
X-Request-ID
```

This makes debugging easier.

For example:

```text
User reports incorrect answer
            ↓
Find request ID
            ↓
Inspect logs
            ↓
Query
Retrieval
Reranking
Context
LLM
Response
```

---

# Caching

The application checks whether an answer already exists for a normalized question.

```text
Question
   ↓
Normalize
   ↓
Cache?
  / \
Yes  No
 |    |
 ▼    ▼
Answer RAG Pipeline
       ↓
      Cache
```

A simple in-memory cache can be used for learning.

For a real distributed production system, a shared cache such as Redis would be more appropriate.

---

# Evaluation

The project contains an evaluation dataset.

```text
evaluation/questions.json
```

At least:

```text
10+ questions
```

Example:

```json
[
  {
    "question": "What is Express middleware?",
    "expectedSources": ["express.md"]
  },
  {
    "question": "What is Node.js?",
    "expectedSources": ["nodejs.md"]
  }
]
```

---

# Evaluation Metrics

The RAG system evaluates retrieval quality using:

## Hit@5

Checks whether at least one relevant source appears in the top 5 results.

```text
Hit@5 = successful queries / total queries
```

## Recall@5

Measures how much of the relevant information is retrieved within the top 5 results.

## MRR

Mean Reciprocal Rank measures how high the first relevant result appears.

```text
MRR = average reciprocal rank
```

---

# Evaluation Report

Results are stored in:

```text
evaluation/results.json
```

The report is stored in:

```text
evaluation/report.md
```

Example:

```text
Questions: 10

Hit@5: 90%
Recall@5: 85%
MRR: 0.78

Average Latency: 1100ms

Cache Hit Rate: 20%
```

The actual project should contain the real measured values rather than example values.

---

# Test Cases

## Test 1 — Normal Question

```text
What is Express middleware?
```

Expected:

```text
Relevant answer
+
express.md source
```

## Test 2 — Exact Technical Term

```text
What does EADDRINUSE mean?
```

This tests keyword retrieval.

## Test 3 — Unknown Question

```text
What is quantum computing?
```

If quantum computing is not in the knowledge base, the system should not invent an answer.

Expected behavior:

```text
I don't have enough information in the
knowledge base to answer that.
```

## Test 4 — Ambiguous Question

```text
How does it work?
```

The system should avoid confidently inventing context when there is insufficient information.

---

# Error Handling

The API handles:

```text
Empty question
Invalid request
Retrieval failure
Embedding failure
LLM failure
Unknown question
Internal server errors
```

Example:

```json
{
  "success": false,
  "message": "Question is required"
}
```

---

# Hallucination Prevention

The system uses multiple techniques:

```text
Relevant Retrieval
        ↓
Reranking
        ↓
Context Filtering
        ↓
Grounded Prompt
        ↓
Source Attribution
        ↓
Evaluation
```

When the knowledge base does not contain enough information, the system should communicate uncertainty instead of generating unsupported technical details.

---

# Service Architecture

The backend separates responsibilities.

```text
Controller
    ↓
Query Service
    ↓
Hybrid Search Service
    ↓
Reranker Service
    ↓
Context Service
    ↓
LLM Service
```

Additional services handle:

```text
Embedding
Vector Search
Keyword Search
Caching
Evaluation
```

This makes the application easier to test, maintain, and extend.

---

# Important Backend Files

### `server.js`

Starts the Express API and registers middleware and routes.

### `chatController.js`

Handles the HTTP request and response.

### `chatRoutes.js`

Defines the `/api/chat` endpoint.

### `queryService.js`

Normalizes the user's question.

### `embeddingService.js`

Creates embeddings.

### `vectorSearchService.js`

Performs semantic retrieval.

### `keywordSearchService.js`

Performs lexical / keyword retrieval.

### `hybridSearchService.js`

Combines vector and keyword results.

### `rerankerService.js`

Ranks retrieved candidates by relevance.

### `contextService.js`

Builds the context supplied to the LLM.

### `llmService.js`

Communicates with the local LLM.

### `cacheService.js`

Stores and retrieves cached answers.

### `evaluationService.js`

Supports evaluation and metrics.

### `requestId.js`

Creates a unique request ID for each request.

---

# Documentation

Architecture documentation:

```text
docs/architecture.md
```

Day 56 learning notes:

```text
notes/day56_notes.md
```

Assignment:

```text
assignment/production_rag.md
```

Evaluation report:

```text
evaluation/report.md
```

---

# Available NPM Scripts

From the project root:

```powershell
npm run dev
```

Starts the Express backend with Nodemon.

```powershell
npm start
```

Starts the Express backend normally.

```powershell
npm run evaluate
```

Runs the evaluation script.

For the frontend:

```powershell
cd frontend
npm run dev
```

---

# Complete Application Flow

```text
                         USER
                           │
                           ▼
                     Next.js UI
                           │
                           ▼
                    POST /api/chat
                           │
                           ▼
                    Express Server
                           │
                           ▼
                      Request ID
                           │
                           ▼
                    Query Processing
                           │
                           ▼
                      Cache Check
                       /       \
                     HIT       MISS
                      │          │
                      │          ▼
                      │    Vector Search
                      │          +
                      │    Keyword Search
                      │          │
                      │          ▼
                      │    Hybrid Retrieval
                      │          │
                      │          ▼
                      │       Reranker
                      │          │
                      │          ▼
                      │    Context Selection
                      │          │
                      │          ▼
                      │        Ollama
                      │          │
                      │          ▼
                      │        Cache
                      │          │
                      └──────────┤
                                 ▼
                         Answer + Sources
                                 │
                                 ▼
                           Next.js UI
```

---

# What I Learned

This capstone demonstrates that production RAG is more than:

```text
LLM + Vector Database
```

A complete RAG system requires:

```text
Retrieval
+
Ranking
+
Context Engineering
+
LLM Generation
+
Source Attribution
+
Evaluation
+
Caching
+
Monitoring
+
Latency Optimization
+
Error Handling
```

The main lesson from Day 56 is that retrieval quality and system engineering are just as important as the LLM itself.

---

# Interview Summary

### How would you explain this project?

> I built a production-oriented RAG knowledge assistant using Next.js, Express, hybrid retrieval, reranking, context engineering, and a local Ollama LLM. The system performs both semantic and keyword retrieval, reranks the candidates, builds a focused context, and generates grounded answers with source attribution. I also added request IDs, caching, latency tracking, and retrieval evaluation using Hit@5, Recall@5, and MRR.

---

# Key Interview Questions

## Why use hybrid retrieval?

Because vector search is good at semantic similarity while keyword retrieval is useful for exact technical terms, identifiers, and phrases. Combining them makes retrieval more robust.

## Why rerank?

Initial retrieval efficiently finds candidates. Reranking provides a more precise relevance ordering before the context is sent to the LLM.

## Why return sources?

Sources improve transparency, debugging, and user trust.

## How do you reduce hallucination?

Use relevant retrieval, reranking, context filtering, grounded prompts, source attribution, evaluation, and explicit handling of missing information.

## How do you reduce latency?

First measure each pipeline stage, identify the bottleneck, then optimize using parallel retrieval, caching, smaller contexts, efficient retrieval, and appropriate model selection.

## Why separate controllers and services?

Controllers handle HTTP concerns while services contain the RAG business logic. This improves maintainability, testing, and reuse.

## What happens if the answer is not in the knowledge base?

The system should not invent an answer. It should clearly state that the available knowledge base does not contain enough information.

---

# Future Improvements

Possible improvements beyond Day 56:

```text
Redis caching
        ↓
Production vector database
        ↓
Dedicated reranker model
        ↓
Streaming LLM responses
        ↓
Authentication
        ↓
Rate limiting
        ↓
Observability dashboard
        ↓
Distributed logging
        ↓
Feedback collection
        ↓
Automated evaluation
        ↓
CI/CD deployment
```

---

# Week 8 Milestone

The progression across Week 8 was:

```text
Basic RAG
   ↓
Advanced RAG
   ↓
RAG Evaluation
   ↓
Production-Oriented RAG
```

Day 56 combines the major concepts into one end-to-end application.

---

# Final Checklist

## Backend

- [x] Express server
- [x] `/health`
- [x] `/api/chat`
- [x] Controller
- [x] Routes
- [x] Query service
- [x] Embedding service
- [x] Vector search
- [x] Keyword search
- [x] Hybrid search
- [x] Reranking
- [x] Context builder
- [x] LLM service
- [x] Cache
- [x] Request ID
- [x] Error handling

## RAG

- [x] Knowledge base
- [x] Document metadata
- [x] Chunking
- [x] Embeddings
- [x] Vector storage
- [x] Hybrid retrieval
- [x] Reranking
- [x] Context selection
- [x] Grounded response
- [x] Source attribution

## Evaluation

- [x] Evaluation questions
- [x] Hit@5
- [x] Recall@5
- [x] MRR
- [x] Latency measurement
- [x] Evaluation report

## Frontend

- [x] Next.js
- [x] Question input
- [x] Send button
- [x] Loading state
- [x] Answer display
- [x] Sources display
- [x] Error display

## Documentation

- [x] `README.md`
- [x] `notes/day56_notes.md`
- [x] `docs/architecture.md`
- [x] `assignment/production_rag.md`
- [x] `evaluation/report.md`

---

# Final Result

```text
                 AI KNOWLEDGE ASSISTANT
                           │
                           ▼
                      Next.js UI
                           │
                           ▼
                      Express API
                           │
                           ▼
                    Query Processing
                           │
                           ▼
                       Cache
                           │
                           ▼
                   Hybrid Retrieval
                    /           \
                   ▼             ▼
               Vector          BM25
               Search         Search
                   \             /
                    \           /
                     ▼         ▼
                       Fusion
                         │
                         ▼
                      Reranker
                         │
                         ▼
                    Top Context
                         │
                         ▼
                    Ollama LLM
                         │
                         ▼
                  Answer + Sources
                         │
                         ▼
                 Evaluation + Logs
```

Day 56 completes Week 8 — Advanced Generative AI.

The project demonstrates an end-to-end, production-oriented RAG architecture rather than a simple LLM question-answering application.
