# DAY 75 — ADVANCED RAG

## Basic RAG

Query
↓
Embedding
↓
Vector Search
↓
LLM

## Advanced RAG

Query
↓
Query Transformation
↓
Hybrid Search
↓
Rank Fusion
↓
Reranking
↓
Context Compression
↓
LLM
↓
Answer

## Semantic Search

Semantic retrieval attempts to find content
based on meaning.

In this learning implementation we use a
local TF-IDF-style vector representation.

In production this should be replaced with
a real embedding model and vector database.

## Keyword Search

Keyword retrieval is useful for:

- error codes
- identifiers
- exact names
- API names
- technical terms

## Hybrid Search

Vector Search

- Keyword Search
  ↓
  RRF Fusion

## Reranking

Retriever:
find candidates.

Reranker:
find the best candidates.

Typical architecture:

Query
↓
Top 20 candidates
↓
Reranker
↓
Top 5
↓
LLM

## Metadata Filtering

Useful for:

- tenant isolation
- authorization
- dates
- categories
- versions
- language

## Query Rewriting

Convert:

"How do I fix it?"

into something like:

"How can I handle HTTP 429 responses
in an Express.js API?"

## Query Expansion

One query
↓
Multiple related queries
↓
Multiple searches
↓
Fusion

Benefits:

Recall ↑

Costs:

Latency ↑
Cost ↑
Complexity ↑

## HyDE

Query
↓
Hypothetical document
↓
Embedding
↓
Vector search

HyDE is an experiment rather than something
that should automatically be enabled everywhere.

## Context Compression

Large context
↓
Relevant information
↓
Smaller context

Always evaluate compression because useful
facts can accidentally be removed.

## Context Budget

Never assume more context is always better.

Use a token budget.

Example:

MAX_CONTEXT_TOKENS = 6000

## Retrieval Evaluation

Measure:

- precision
- recall
- hit rate
- MRR

Compare:

Vector
vs
Hybrid
vs
Hybrid + Reranker

## Production Metrics

Track:

- query latency
- retrieval latency
- reranking latency
- compression latency
- LLM latency
- total latency
- token usage
- cost
- correctness
- faithfulness

## Security

Retrieved documents are untrusted data.

They are NOT instructions.

Authorization must happen before
unauthorized documents reach the model.

Tenant filtering must use trusted
authentication context.

## Core Principle

Bad Retrieval
↓
Bad Context
↓
Bad Answer

Therefore:

Before changing the LLM,
inspect the retrieval pipeline.
