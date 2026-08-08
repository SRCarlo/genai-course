# Day 56 — Production RAG Capstone

## Project

AI Knowledge Base Assistant

## Models

LLM:

llama3.2:3b

Embedding:

nomic-embed-text

## Architecture

Next.js
↓
Express API
↓
Query Processing
↓
Cache
↓
Vector Search + Keyword Search
↓
Hybrid Fusion
↓
Reranking
↓
Context Selection
↓
Ollama LLM
↓
Answer + Sources
↓
Evaluation and Metrics

## Knowledge Base

The project contains 10 technical documents.

## Ingestion

Documents are:

1. Read
2. Chunked
3. Tokenized
4. Embedded
5. Stored in the local vector store

## Retrieval

The application performs:

- Vector similarity search
- BM25 keyword search
- Hybrid rank fusion

## Reranking

The project includes a reranking stage.

For this local capstone, llama3.2:3b is used as a lightweight relevance judge.

A dedicated cross-encoder reranker would be preferable for a production deployment.

## Context Engineering

Only the top reranked documents are passed to the LLM.

## Generation

The LLM receives a grounded prompt instructing it to answer using only retrieved context.

## Source Attribution

The API returns:

- Source filename
- Category
- Chunk ID

## Evaluation

The evaluation dataset contains more than 10 questions.

Metrics:

- Hit@5
- Recall@5
- MRR
- Latency

## Performance

The API tracks:

- Retrieval latency
- Reranking latency
- LLM latency
- Total latency

## Caching

A simple in-memory cache is implemented.

For distributed production systems, Redis or another shared cache should be used.

## Request IDs

Every API request receives a unique request ID.

This makes debugging individual requests easier.

## Error Handling

The API handles:

- Missing questions
- Invalid routes
- Retrieval failures
- LLM failures
- Internal errors

## Production Limitations

The current implementation uses a local JSON vector store.

A production deployment should use a dedicated vector database.

The local in-memory cache should be replaced with a distributed cache.

The LLM-based reranker should generally be replaced by a dedicated reranking model.

## Main Lesson

Production RAG is not simply:

LLM + Vector Database.

It requires:

Retrieval

- Ranking
- Context Engineering
- Generation
- Evaluation
- Caching
- Monitoring
- Error Handling
- Performance Optimization
