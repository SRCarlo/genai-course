# DAY 54 — Advanced RAG

## Month 3 — Advanced Generative AI

## Topic

Advanced Retrieval-Augmented Generation (Advanced RAG)

---

# 1. Overview

Advanced RAG improves basic RAG by improving the retrieval pipeline before information reaches the LLM.

Basic RAG:

```
Query
 ↓
Embedding
 ↓
Vector Search
 ↓
Context
 ↓
LLM
 ↓
Answer
```

Advanced RAG:

```
Query
 ↓
Query Transformation
 ↓
Hybrid Retrieval
 ↓
Reranking
 ↓
Context Compression
 ↓
LLM
 ↓
Answer
```

Advanced RAG focuses on:

- Better retrieval
- Better context quality
- Lower hallucination
- Higher accuracy

---

# 2. Learning Objectives

By the end of Day 54:

- Understand Semantic Search
- Understand Keyword Search
- Understand BM25
- Build Hybrid Search systems
- Understand Metadata Filtering
- Understand Query Rewriting
- Understand Multi Query Retrieval
- Understand HyDE
- Understand Reranking
- Understand Context Compression
- Understand RAG Evaluation
- Understand Production RAG Architecture

---

# 3. Basic RAG Architecture

```
User Query
     |
     v
Embedding Model
     |
     v
Vector Database
     |
     v
Similarity Search
     |
     v
Relevant Chunks
     |
     v
LLM
     |
     v
Answer
```

---

# 4. Advanced RAG Architecture

```
                 User Query
                      |
                      v
            Query Transformation
                      |
                      v

          +-----------+-----------+
          |                       |
          v                       v

    Vector Search          Keyword Search

          |                       |
          +-----------+-----------+

                      |
                      v

              Hybrid Search

                      |
                      v

                 Reranker

                      |
                      v

             Context Compression

                      |
                      v

                Prompt Builder

                      |
                      v

                  Ollama / LLM

                      |
                      v

                 Final Answer
```

---

# 5. Semantic Search

## Definition

Semantic Search uses embeddings to find documents based on meaning.

It does not depend only on exact words.

Example:

Query:

```
How do I handle missing routes?
```

Retrieved:

```
Express returns 404 when no matching route exists.
```

The words are different but the meaning is similar.

---

## Advantages

- Understands meaning
- Supports synonyms
- Works well with natural language

---

## Limitations

- May miss exact identifiers
- Weak for error codes
- Weak for version numbers

Example:

```
EADDRINUSE
404
NodeError123
```

---

# 6. Keyword Search

## Definition

Keyword Search finds documents using exact matching words.

Example:

Query:

```
Express middleware
```

Document:

```
Express middleware documentation
```

---

## Best For

- API names
- Function names
- Class names
- Error codes
- Product IDs
- Version numbers

---

# 7. BM25

BM25 means:

```
Best Matching 25
```

It is a lexical ranking algorithm.

It considers:

- Term Frequency
- Document Frequency
- Document Length

Purpose:

Rank documents according to keyword relevance.

---

# 8. Vector Search vs Keyword Search

| Feature             | Vector Search | Keyword Search |
| ------------------- | ------------- | -------------- |
| Semantic Meaning    | Excellent     | Limited        |
| Exact Matching      | Moderate      | Excellent      |
| Synonyms            | Excellent     | Poor           |
| Error Codes         | Moderate      | Excellent      |
| Natural Language    | Excellent     | Good           |
| Embeddings Required | Yes           | No             |

---

# 9. Hybrid Search

Hybrid Search combines:

```
Vector Search
+
Keyword Search
```

Architecture:

```
              Query
                |
        +-------+-------+
        |               |
        v               v

 Vector Search    Keyword Search

        |               |
        +-------+-------+

                |
                v

          Merge Results

                |
                v

          Top Documents
```

Benefits:

- Better recall
- Better precision
- Handles semantic meaning
- Handles exact keywords

---

# 10. Reciprocal Rank Fusion (RRF)

RRF combines ranking results from multiple search systems.

Formula:

```
Score = Σ 1 / (k + rank)
```

Why?

Different systems have different scoring methods.

RRF combines ranking positions instead of raw scores.

---

# 11. Metadata Filtering

Documents should store metadata.

Example:

```json
{
  "source": "express.md",
  "framework": "express",
  "language": "javascript",
  "category": "backend"
}
```

Benefits:

- Faster retrieval
- Better filtering
- Debugging
- Source tracking
- Access control

---

# 12. Query Rewriting

Users may ask unclear questions.

Original:

```
Why doesn't my Express thing work?
```

Rewritten:

```
Express middleware lifecycle and common middleware errors
```

Benefits:

- Better search query
- Better retrieval
- Better answers

---

# 13. Multi Query Retrieval

One question can generate multiple queries.

Example:

Question:

```
How does Express authentication work?
```

Generated:

```
Express authentication middleware

Express JWT authentication

Express authorization flow
```

Advantages:

- Better recall
- More relevant documents

Disadvantages:

- More latency
- More cost

---

# 14. HyDE

HyDE:

```
Hypothetical Document Embeddings
```

Process:

```
Question

↓

Generate hypothetical answer

↓

Create embedding

↓

Search documents
```

Purpose:

Generated text may match document vocabulary better.

---

# 15. Reranking

Retrieval finds candidates quickly.

Reranking chooses the best documents.

Example:

```
100 Documents

       ↓

Retrieval

       ↓

20 Documents

       ↓

Reranker

       ↓

Top 5 Documents
```

Benefits:

- Higher relevance
- Better context quality

---

# 16. Context Compression

Instead of sending:

```
10 Retrieved Chunks
```

Send:

```
3 Most Relevant Chunks
```

Benefits:

- Less token usage
- Faster response
- Less noise
- Less hallucination

---

# 17. Source Tracking

Store metadata with every chunk.

Example:

```json
{
  "text": "Express middleware",
  "source": "express.md",
  "score": 0.91
}
```

Benefits:

- Citations
- Debugging
- Trust
- Explainability

---

# 18. Retrieval Evaluation

A production RAG system must be measured.

Important metrics:

## Precision

How many retrieved documents are relevant?

## Recall

How many relevant documents were found?

## Recall@K

Was the correct document inside top K?

## MRR

Mean Reciprocal Rank.

Measures position of first relevant result.

---

# 19. Evaluation Example

| Query               | Expected Source | Retrieved Source | Correct |
| ------------------- | --------------- | ---------------- | ------- |
| What is Middleware? | express.md      | express.md       | ✅      |
| What is MongoDB?    | mongodb.md      | mongodb.md       | ✅      |

---

# 20. RAG Failure Modes

## Wrong Retrieval

```
Question

↓

Wrong Documents

↓

Wrong Answer
```

---

## Too Much Context

Too many irrelevant chunks confuse the LLM.

---

## Missing Context

Correct document is not retrieved.

---

## Poor Chunking

Important information is split incorrectly.

---

## Ambiguous Query

Bad query causes bad retrieval.

---

# 21. Production RAG Architecture

```
User

↓

Frontend (Next.js)

↓

Express API

↓

Query Transformation

↓

Hybrid Retrieval

↓

Result Fusion

↓

Reranker

↓

Context Compression

↓

Prompt Builder

↓

Ollama / Cloud LLM

↓

Answer
```

---

# 22. Best Practices

- Use meaningful chunks
- Store metadata
- Combine vector + keyword search
- Use reranking
- Limit context size
- Track sources
- Evaluate retrieval quality
- Measure latency

---

# 23. Interview Questions & Answers

## Q1. What is RAG?

Answer:

RAG combines information retrieval with an LLM.

Relevant documents are retrieved first and provided as context for generating accurate answers.

---

## Q2. What is Semantic Search?

Answer:

Semantic Search uses embeddings to retrieve documents based on meaning instead of exact keywords.

---

## Q3. What is Keyword Search?

Answer:

Keyword Search retrieves documents using exact words and is useful for APIs, identifiers, and error codes.

---

## Q4. What is BM25?

Answer:

BM25 is a lexical ranking algorithm based on term frequency, document frequency, and document length.

---

## Q5. What is Hybrid Search?

Answer:

Hybrid Search combines vector search and keyword search to improve retrieval quality.

---

## Q6. What is Reranking?

Answer:

Reranking reorders retrieved documents using a deeper relevance model before sending them to the LLM.

---

## Q7. What is Query Rewriting?

Answer:

Query rewriting converts user questions into better search queries.

---

## Q8. What is Multi Query Retrieval?

Answer:

It generates multiple related queries and combines their retrieval results.

---

## Q9. What is Metadata Filtering?

Answer:

Metadata filtering limits retrieval using document properties like category, source, and version.

---

## Q10. What is HyDE?

Answer:

HyDE creates a hypothetical answer, embeds it, and uses it for retrieval.

---

## Q11. What is RRF?

Answer:

Reciprocal Rank Fusion combines ranked results from different retrieval systems.

---

## Q12. How do you improve a poor RAG system?

Answer:

Check each stage:

```
Chunking

↓

Embedding Model

↓

Retrieval

↓

Hybrid Search

↓

Reranking

↓

Context Selection

↓

Prompt

↓

LLM
```

Measure before optimizing.

---

# 24. Key Takeaway

A bad RAG answer is not always an LLM problem.

The issue may be:

```
Bad Chunking

↓

Bad Embeddings

↓

Poor Retrieval

↓

Wrong Context

↓

Incorrect Answer
```

A GenAI engineer should measure every stage and identify the real bottleneck.

---
