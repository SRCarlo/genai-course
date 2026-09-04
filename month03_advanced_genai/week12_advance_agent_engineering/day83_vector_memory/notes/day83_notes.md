# Day 83 — Vector Memory, Embeddings & Semantic Retrieval

```
## Core idea

Traditional memory search:

User Query
↓
Keyword Search
↓
Matching Text

Vector memory:

User Query
↓
Embedding
↓
Vector
↓
Similarity Search
↓
Relevant Memories
↓
LLM

## Embeddings

An embedding converts text into a numerical vector.

Example:

"User prefers Node.js"

↓

[0.12, -0.43, 0.87, ...]

Semantically related text should be close in vector space when using a real semantic embedding model.

## Cosine similarity

Cosine similarity compares the direction of two vectors.

1 = very similar direction
0 = orthogonal
-1 = opposite direction

## Top-K

Instead of sending every memory to the LLM:

10000 memories
↓
Search
↓
Top 5
↓
LLM

## Metadata filtering

Always filter by userId.

Example:

userId = user123
type = preference

## Hybrid retrieval

Production retrieval can combine:

Semantic similarity

- Keyword match
- Importance
- Recency
- Metadata

## Final score

Example:

0.60 semantic similarity

- 0.20 importance
- 0.10 recency
- 0.10 keyword match

## Token-aware retrieval

Never blindly send all retrieved memories.

Retrieve
↓
Rank
↓
Apply token budget
↓
Context builder
↓
LLM

## Deduplication

Before storing:

New memory
↓
Embedding
↓
Search existing memories
↓
High similarity?
↓
Skip or update

## Memory lifecycle

Conversation
↓
Memory extraction
↓
Validation
↓
Deduplication
↓
Embedding
↓
Storage
↓
Retrieval
↓
Context injection
↓
LLM
↓
Update / Expire / Delete

## Security

Always isolate memory by userId.

Never allow:

userA → userB memory

## Day 83 architecture

User
↓
Agent
↓
Memory Manager
↓
Embedding Service
↓
Vector Store
↓
Semantic Retriever
↓
Context Builder
↓
Groq LLM
↓
Memory Extraction
↓
Validation
↓
Deduplication
↓
Storage
```
