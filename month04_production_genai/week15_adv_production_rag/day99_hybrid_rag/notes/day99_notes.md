# Day 99 — Production RAG: Hybrid Search, Reranking & Retrieval Quality

## Core Concepts

- Vector search → semantic similarity
- Keyword search → exact matching
- Hybrid search → vector + keyword
- RRF → rank-based fusion
- Reranking → second-stage relevance ranking
- Query rewriting → retrieval-friendly query transformation
- Query expansion → alternative query terms
- Deduplication → remove repeated documents
- Relevance filtering → remove weak candidates

## Groq

Provider: Groq
Model: `openai/gpt-oss-20b`
Used for query rewriting, query expansion, reranking and final grounded answer.

## Pipeline

User Query → Rewrite → Expansion → Vector + Keyword → RRF → Candidates → Reranker → Deduplication → Relevance Filter → Context Builder → LLM

## Metrics

Recall@K, Precision@K and MRR.

## Key principle

Retrieval is an engineering system, not a single database query.
