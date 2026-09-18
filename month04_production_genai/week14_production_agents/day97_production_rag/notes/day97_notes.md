# Day 97 — Production RAG Notes

## 1. What is RAG?

RAG stands for Retrieval-Augmented Generation.

The application retrieves relevant external information
and provides that information to the LLM as context.

Flow:

```
Question
↓
Embedding
↓
Vector Search
↓
Relevant Chunks
↓
Context
↓
LLM
↓
Answer
```

---

## 2. Production RAG

Production RAG is more than calling an LLM.

It includes:

- document ingestion
- chunking
- embeddings
- vector storage
- metadata
- retrieval
- context building
- grounded generation
- source attribution
- authentication
- authorization
- tenant isolation
- validation
- error handling
- observability
- testing

---

## 3. Document Ingestion

```
Document
↓
Load
↓
Clean
↓
Chunk
↓
Embed
↓
Vector Store
```

---

## 4. Chunking

Chunking divides large documents into
smaller searchable pieces.

Overlap provides neighboring chunks
with shared context.

Too much overlap can increase:

- storage
- retrieval redundancy
- context size
- cost

---

## 5. Embeddings

Text is converted into a numerical vector.

Similar meanings should have similar vectors.

---

## 6. Vector Repository

The application should depend on:

vectorRepository.search()

instead of:

pinecone.query()

This makes the vector provider replaceable.

---

## 7. Retrieval

Typical retrieval:

```
Query
↓
Embedding
↓
Vector Search
↓
Top-K
↓
Filtering
↓
Threshold
↓
Reranking
↓
Context
```

---

## 8. Context Builder

Only relevant chunks should be provided to
the LLM.

Do not dump every document chunk into the prompt.

---

## 9. Grounded Generation

The LLM should answer using the retrieved context.

If context is insufficient:

"I don't have enough information to answer that."

---

## 10. Source Attribution

Sources should be generated from the
retrieved database/vector records.

The LLM should not be trusted to decide
which sources were actually retrieved.

---

## 11. Tenant Isolation

Tenant filtering must happen before
retrieved information reaches the LLM.

Example:

```
{
tenantId: "company-a"
}
```

---

## 12. Document Lifecycle

```
UPLOADED
↓
PROCESSING
↓
READY

```

or:

```
UPLOADED
↓
PROCESSING
↓
FAILED
```

---

## 13. Architecture

```
Controller
↓
Application Service
↓
RAG Service
↓
Retriever
↓
Embedding / Vector DB / LLM
```

---

## 14. Groq

This project uses:

Provider:
Groq

Model:
`openai/gpt-oss-20b`

API key:
`GROQ_API_KEY`

The LLM provider is isolated inside:

src/ai/llm/llm.service.js

---

## 15. Main Mental Model

RAG is not just an LLM feature.

It is an end-to-end:

data

- retrieval
- AI
- application
- security
- infrastructure

system.
