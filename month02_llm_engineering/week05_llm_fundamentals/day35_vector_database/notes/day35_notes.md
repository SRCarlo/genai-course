# Day 35 - Vector Databases (Production RAG Foundation)

# 1. What is a Vector Database?

A Vector Database is a specialized database that stores vector embeddings and performs similarity search.

Traditional databases store:

- Rows
- Columns
- Text
- Numbers

Vector databases store:

- Embeddings
- Vectors
- Metadata

Example:

Document:

Node.js is used for backend development.

Embedding Model converts it into:

```
[
0.24,
-0.13,
0.71,
0.45
]
```

This vector represents the meaning of the document.

---

# 2. What are Embeddings?

Embeddings are numerical representations of data.

They convert:

- Text
- Images
- Audio
- Documents

into mathematical vectors.

Example:

Text:

```
JavaScript server runtime
```

Embedding:

```
[
0.21,
0.45,
0.67,
0.12
]
```

Similar meanings create similar vectors.

Example:

```
Node.js backend development

JavaScript server runtime
```

will have similar embeddings.

---

# 3. Why Do We Need Vector Databases?

Traditional databases use keyword matching.

Example:

```sql
SELECT *
FROM documents
WHERE text LIKE '%JavaScript%';
```

Problem:

User Query:

```
JavaScript server runtime
```

Document:

```
Node.js backend development
```

The words are different.

SQL search fails.

Vector search understands meaning.

Flow:

```
User Query

↓

Embedding Model

↓

Query Vector

↓

Vector Database

↓

Similar Documents
```

---

# 4. SQL Database vs Vector Database

| SQL Database   | Vector Database   |
| -------------- | ----------------- |
| Stores tables  | Stores vectors    |
| Keyword search | Semantic search   |
| Exact matching | Meaning matching  |
| SQL queries    | Similarity search |
| Transactions   | AI retrieval      |

---

# 5. How Similarity Search Works

Vector databases compare the query vector with stored vectors.

Example:

Document Vector:

```
[0.2,0.5,0.8]
```

Query Vector:

```
[0.25,0.55,0.75]
```

The closest vector is returned as the result.

---

# 6. Cosine Similarity

Cosine similarity measures similarity between two vectors.

Formula:

```
Similarity =

(A . B)
---------
||A|| ||B||
```

Range:

```
1  = Very similar

0  = Not related

-1 = Opposite
```

Used in:

- Semantic Search
- RAG Systems
- Recommendation Systems

---

# 7. Vector Database Architecture

```
User

↓

Application

↓

Embedding Model

↓

Vector Database

↓

Relevant Documents

↓

LLM

↓

Answer
```

---

# 8. Popular Vector Databases

## FAISS

Facebook AI Similarity Search.

Used for:

- Local development
- Research
- Fast similarity search

## ChromaDB

Used for:

- Beginner RAG projects
- Local AI applications

## Pinecone

Used for:

- Cloud vector database
- Production applications

## Qdrant

Used for:

- Open source production systems

## Weaviate

Used for:

- Enterprise AI applications

## Milvus

Used for:

- Large scale vector search

---

# 9. RAG Data Flow

```
PDF

↓

Text Extraction

↓

Chunking

↓

Embedding Generation

↓

Vector Database

↓

Similarity Search

↓

Relevant Chunks

↓

LLM

↓

Answer
```

---

# 10. Document Chunking

Large documents are divided into smaller pieces.

Example:

Before:

```
100 page PDF
```

After:

```
Chunk 1

Chunk 2

Chunk 3
```

Benefits:

- Better retrieval
- Faster search
- More accurate answers

---

# 11. Metadata

Metadata is additional information stored with vectors.

Example:

```json
{
  "text": "Node.js Guide",

  "metadata": {
    "author": "John",
    "source": "Book",
    "page": 10
  }
}
```

Metadata helps filtering.

Examples:

- Search only PDFs
- Search by author
- Search specific pages

---

# 12. Local Vector Store

Simple vector store:

```javascript
const vectorStore = [];

vectorStore.push({
  document,

  embedding,
});
```

Used for learning.

Production systems use:

- FAISS
- ChromaDB
- Pinecone
- Qdrant

---

# 13. Best Practices

## Generate Embeddings Once

Create document embeddings once and store them.

## Cache Embeddings

Benefits:

- Faster response
- Lower API cost

## Store Metadata

Metadata improves filtering.

## Use Same Embedding Model

Documents and queries must use the same embedding model.

Correct:

```
Documents → Model A

Query → Model A
```

Wrong:

```
Documents → Model A

Query → Model B
```

---

# 14. Common Mistakes

## Using SQL Keyword Search

SQL cannot understand semantic meaning.

## Mixing Embedding Models

Different models create incompatible vectors.

## Ignoring Metadata

Makes filtering difficult.

## Recreating Embeddings

Wastes computation and API cost.

## Poor Chunking

Creates bad retrieval results.

---

# 15. Vector Database Role in RAG

RAG means:

Retrieval-Augmented Generation

Without RAG:

```
User

↓

LLM

↓

Answer
```

With RAG:

```
User

↓

Vector Database

↓

Relevant Context

↓

LLM

↓

Answer
```

---

# Mini Project - Mini Local Vector Database

Features:

- Load documents.json
- Generate embeddings
- Store vectors in memory
- Search using cosine similarity
- Return top results

Architecture:

```
Documents

↓

Embeddings

↓

Vector Store

↓

Similarity Search

↓

Results
```

---

# Interview Questions and Answers

## 1. What is a Vector Database?

Answer:

A vector database is a specialized database that stores embeddings and performs similarity search.

It helps AI systems find information based on meaning instead of exact keywords.

---

## 2. What are embeddings?

Answer:

Embeddings are numerical representations of data that capture semantic meaning.

They allow machines to compare relationships between information.

---

## 3. Why can't SQL databases perform semantic search?

Answer:

SQL databases mainly use keyword and exact matching.

They cannot understand that different words can have similar meanings.

Example:

```
JavaScript runtime

and

Node.js backend
```

---

## 4. What is similarity search?

Answer:

Similarity search finds vectors that are mathematically closest to a query vector.

---

## 5. What is cosine similarity?

Answer:

Cosine similarity calculates the similarity between two vectors by measuring the angle between them.

---

## 6. Why are embeddings important?

Answer:

Embeddings allow AI systems to understand relationships between data.

They are used in:

- Search
- RAG
- Recommendation systems
- AI assistants

---

## 7. What is metadata?

Answer:

Metadata is additional information stored with vectors.

Examples:

- Author
- Source
- Page number
- Date

---

## 8. Why is vector database important for RAG?

Answer:

A vector database retrieves relevant information before sending context to the LLM.

This improves answer quality.

---

## 9. Can a vector database replace an LLM?

Answer:

No.

A vector database stores and retrieves information.

An LLM generates responses.

---

## 10. Why cache embeddings?

Answer:

Caching reduces:

- API calls
- Processing time
- Cost

---

## 11. Difference between SQL and Vector Database?

SQL Database:

- Structured data
- Exact matching
- Transactions

Vector Database:

- Stores embeddings
- Semantic search
- AI retrieval

---

## 12. What is RAG?

Answer:

RAG stands for Retrieval-Augmented Generation.

It combines:

1. Retrieval system
2. Vector database
3. LLM generation

---

## 13. Why chunk documents?

Answer:

Chunking improves retrieval accuracy and allows the LLM to receive only relevant information.

---

## 14. Why use the same embedding model?

Answer:

Because embeddings created by different models are not directly comparable.

---

## 15. Name popular vector databases.

Answer:

- FAISS
- ChromaDB
- Pinecone
- Qdrant
- Weaviate
- Milvus

---

# Day 35 Final Summary

Important Concepts:

- Embeddings convert data into vectors
- Vector databases store embeddings
- Similarity search finds related information
- Cosine similarity compares vectors
- Metadata improves retrieval
- Vector databases are the foundation of RAG

Production Flow:

```
Documents

↓

Embeddings

↓

Vector Database

↓

Similarity Search

↓

Relevant Context

↓

LLM

↓

Answer
```
