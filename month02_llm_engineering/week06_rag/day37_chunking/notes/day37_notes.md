# Day 37 Notes

## What is Chunking?

Chunking means splitting large documents into smaller pieces before generating embeddings.

---

## Why Chunking?

- Better Retrieval
- Less Context
- Faster Embeddings
- Higher Accuracy

---

## Chunking Types

### Fixed Chunking

Split text by fixed number of characters.

Example

100 Characters

↓

Chunk

---

### Recursive Chunking

Split by

Paragraph

↓

Sentence

↓

Word

Maintains context.

---

### Sliding Window

Chunks overlap.

Example

1 2 3

2 3 4

3 4 5

---

### Token Chunking

Uses token count instead of character count.

Production:

Chunk Size = 500

Overlap = 100

---

### Semantic Chunking

Split based on meaning.

Example

AI Topic

↓

Chunk

Database Topic

↓

Chunk

---

## Best Practices

Chunk Size

500

Overlap

100

Metadata

```json
{
  "page": 5,
  "source": "nodejs.pdf"
}
```

Top K

3

---

## RAG Pipeline

PDF

↓

Chunking

↓

Embeddings

↓

Vector Database

↓

Retriever

↓

Top Chunks

↓

LLM

↓

Answer

---

## Common Mistakes

- No overlap
- Large chunks
- Tiny chunks
- Ignoring metadata
- Character chunking only

---

## Interview Questions

### What is Chunking?

Splitting documents into smaller pieces before embedding.

---

### Why is chunking important?

Better retrieval quality.

---

### What is overlap?

Repeating text between chunks.

---

### Which chunking is common?

Recursive Chunking

---

### Recommended chunk size?

500 Tokens

100 Overlap

---

### Libraries

- LangChain
- LlamaIndex
- Haystack
