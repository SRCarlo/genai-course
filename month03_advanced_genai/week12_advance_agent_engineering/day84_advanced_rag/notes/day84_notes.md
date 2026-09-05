# Day 84 — Advanced RAG Notes

# What is RAG?

RAG stands for Retrieval-Augmented Generation.

Instead of asking an LLM to answer only from its trained knowledge, RAG retrieves relevant information from an external knowledge source and provides that information as context.

```
Question
   ↓
Retrieve relevant information
   ↓
Add information to prompt
   ↓
LLM generates answer
```

# Why Advanced RAG?

Basic RAG can fail when:

- The query is ambiguous.
- The query uses different terminology from the documents.
- The retrieved documents are only partially relevant.
- Too many irrelevant chunks are retrieved.
- Important information is buried inside large documents.
- The context contains redundant information.

Advanced RAG introduces additional stages to solve these problems.

# 1. Document Chunking

Documents are usually too large to send directly to the LLM.

Therefore, documents are divided into chunks.

Example:

```
Large Document
↓
┌─────────────┐
│ Chunk 1 │
├─────────────┤
│ Chunk 2 │
├─────────────┤
│ Chunk 3 │
└─────────────┘
```

# Chunk Size

Very small chunks may lose context.

Very large chunks may:

- Reduce retrieval precision
- Increase token usage
- Add irrelevant information

A practical chunking strategy should balance context and retrieval precision.

Chunk Overlap

Chunks can overlap to avoid losing information at boundaries.

```
Chunk 1: A B C D E
Chunk 2:       D E F G H
Chunk 3:             G H I J K
```

# 2. Query Rewriting

Users don't always formulate queries in a way that works well for retrieval.

Example:

```
User:
"How does this thing actually work?"
```

A query rewriting stage can convert it into a more explicit search query.

```
"How does retrieval augmented generation work?"
```

The goal is to make the query clearer and more useful for retrieval.

# 3. Query Expansion

Instead of performing retrieval with only one query, multiple related queries can be generated.

Example:

```
Original Query:
"What is RAG?"
```

Possible expanded queries:

```
"What is retrieval augmented generation?"
"How does RAG work?"
"What are the benefits of RAG?"
```

Results from the different queries can then be combined.

# Benefit

Query expansion can improve recall.

# 4. Retrieval

Retrieval searches the document collection for potentially relevant chunks.

A retrieval system may use:

- Keyword search
- BM25
- Vector similarity
- Hybrid search

# Vector Retrieval

A query can be converted into an embedding.

Documents are also represented as embeddings.

Similarity can then be calculated between:

```
Query Embedding
↓
Similarity Search
↓
Relevant Document Embeddings
```

# 1. Retrieval vs Reranking

Retrieval and reranking serve different purposes.

# Retrieval

Retrieval should be fast and retrieve a reasonably broad set of candidates.

Example:

```
1000 documents
↓
Retriever
↓
20 candidates
```

# Reranking

The reranker performs a more detailed relevance comparison.

```
20 candidates
↓
Reranker
↓
5 best documents
```

This two-stage approach provides a balance between speed and quality.

# 6. Reranking

Reranking reorders retrieved documents based on their relevance to the query.

Example:

```
Before:

Document A → score 0.71
Document B → score 0.92
Document C → score 0.65

After:

Document B → score 0.92
Document A → score 0.71
Document C → score 0.65
```

The highest-quality documents are then placed into the final context.

# 7. Context Construction

After reranking, only the most useful chunks should be passed to the LLM.

```
Retrieved Documents
↓
Reranking
↓
Top-K Documents
↓
Context Builder
↓
LLM
```

Good context construction helps reduce:

- Noise
- Token usage
- Redundant information
- Irrelevant content

# 8. Query Decomposition

Complex questions can sometimes be divided into smaller questions.

Example:

```
"Compare RAG and fine-tuning and explain when each should be used."
```

Can become:

```
1. What is RAG?
2. What is fine-tuning?
3. What are the advantages of RAG?
4. What are the advantages of fine-tuning?
5. When should RAG be used?
6. When should fine-tuning be used?
```

Each sub-question can be retrieved independently.

# 9. HyDE

HyDE stands for Hypothetical Document Embeddings.

The system first generates a hypothetical answer/document for the query.

Then the hypothetical document is embedded and used for retrieval.

```
User Query
↓
Hypothetical Answer
↓
Embedding
↓
Vector Search
↓
Relevant Documents
```

This can help when the wording of the query differs significantly from the wording in the documents.

# 10. Hybrid Search

Hybrid search combines multiple retrieval strategies.

For example:

```
Keyword Search ───┐
                  ├──→ Combined Results
Vector Search ────┘
```

Keyword search is useful for:

- Names
- IDs
- Exact terms
- Technical keywords

Vector search is useful for:

- Semantic similarity
- Paraphrases
- Conceptual relationships

# 11. Advanced RAG Pipeline

A more complete architecture can look like:

```

                  User Query
                      │
                      ▼
              Query Rewriting
                      │
                      ▼
               Query Expansion
                      │
             ┌────────┴────────┐
             ▼                 ▼
       Keyword Search    Vector Search
             │                 │
             └────────┬────────┘
                      ▼
               Candidate Set
                      │
                      ▼
                  Reranking
                      │
                      ▼
                 Top-K Chunks
                      │
                      ▼
              Context Building
                      │
                      ▼
                    LLM
                      │
                      ▼
                Final Answer
```

# 12. Important RAG Metrics

# Recall

Measures how much of the relevant information was retrieved.

High recall means fewer relevant documents are missed.

# Precision

Measures how many retrieved documents are actually relevant.

High precision means less irrelevant information.

# Faithfulness

Measures whether the generated answer is supported by the retrieved context.

# Answer Relevance

Measures whether the final answer actually addresses the user's question.

# Key Takeaways

- RAG connects LLMs to external knowledge.
- Chunking affects retrieval quality.
- Query rewriting makes queries easier to retrieve.
- Query expansion can improve recall.
- Retrieval finds candidate documents.
- Reranking improves the ordering of candidates.
- Context construction controls what the LLM sees.
- Hybrid search combines keyword and semantic retrieval.
- Query decomposition helps with complex questions.
- Advanced RAG focuses on improving retrieval quality before generation.
