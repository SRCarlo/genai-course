# DAY 36 — Retrieval-Augmented Generation (RAG)

## Module: Month 2 — LLM Engineering

# 1. What is RAG?

RAG stands for:

Retrieval-Augmented Generation

RAG is a technique that combines:

1. Information Retrieval
2. Large Language Model Generation

Instead of directly asking an LLM to answer a question, RAG first searches for relevant information from external data sources and then provides that information to the LLM as context.

Basic idea:

User Question

↓

Retrieve Relevant Documents

↓

Add Retrieved Information to Prompt

↓

Send Prompt to LLM

↓

Generate Grounded Answer

Example:

Question:

"What is our company leave policy?"

Without RAG:

LLM:

"I don't know."

With RAG:

Search company documents

↓

Find leave policy document

↓

Send policy as context

↓

Generate answer:

"Employees receive 20 paid leaves every year."

---

# 2. Why RAG is Needed

Large Language Models have limitations:

## 1. Knowledge Cutoff

LLMs are trained on past data.

They do not automatically know:

- New company documents
- Private files
- Internal policies
- Personal databases

Example:

Question:

"What is our company's HR policy?"

Normal LLM:

Cannot answer.

RAG:

Searches company documents and answers.

---

## 2. Hallucination Problem

LLMs sometimes generate incorrect information.

Example:

Question:

"What is the company's refund policy?"

Without context:

LLM may create a fake policy.

With RAG:

LLM only uses retrieved company documents.

---

## 3. Private Data Access

RAG allows AI applications to use:

- PDFs
- Documentation
- Database records
- Company files
- Knowledge bases

---

# 3. RAG Architecture

Complete RAG pipeline:

User

↓

Question

↓

Embedding Model

↓

Vector Database

↓

Similarity Search

↓

Top Matching Documents

↓

Context Injection

↓

LLM (Groq)

↓

Final Answer

---

# 4. Components of RAG

## 1. Document Collection

Source data used by RAG.

Examples:

- PDFs
- Websites
- Documentation
- Text files

Example:

documents.json

```json
[
  {
    "text": "Express.js is a backend framework for Node.js."
  }
]
```

---

## 2. Chunking

Large documents are divided into smaller pieces.

Example:

Bad:

One 50,000 word document

Good:

500 word chunks

Benefits:

- Better retrieval
- Faster search
- Less token usage

---

## 3. Embeddings

Embeddings convert text into numbers.

Example:

Text:

"Express.js is a backend framework"

becomes:

[
0.123,
0.452,
0.765
]

These numbers represent semantic meaning.

Similar meanings produce similar vectors.

Example:

"How to create APIs?"

and

"Building backend services"

will have similar embeddings.

---

# 5. Embedding Models

Common embedding models:

- all-MiniLM-L6-v2
- BGE
- OpenAI Embeddings
- Cohere Embeddings

Day 36 uses:

Sentence Transformer Embeddings

---

# 6. Vector Database

A vector database stores embeddings.

Examples:

- Qdrant
- Pinecone
- Chroma
- Weaviate
- Milvus

It allows semantic search.

Example:

Stored:

Document A:

"Node.js runtime"

Document B:

"React frontend library"

Question:

"JavaScript backend runtime"

Vector search finds:

Document A

---

# 7. Semantic Search

Traditional search:

Matches exact words.

Example:

Search:

"JS backend"

May fail to find:

"Node.js runtime"

Semantic search:

Understands meaning.

It finds related concepts.

---

# 8. Cosine Similarity

Cosine similarity measures similarity between vectors.

Formula:

similarity =

(A · B)

---

(|A| × |B|)

Range:

1 = Very similar

0 = Not related

-1 = Opposite

Day 36 uses cosine similarity for finding matching documents.

---

# 9. Context Injection

Context injection means adding retrieved documents into the prompt before sending it to the LLM.

Example:

Retrieved context:

"Express.js is a backend framework for Node.js."

Prompt:

Use only this context.

Context:

Express.js is a backend framework for Node.js.

Question:

What is Express.js?

LLM:

Express.js is a backend framework for Node.js.

---

# 10. Groq Integration

Groq provides fast LLM inference.

Day 36 flow:

Retrieved Context

↓

Prompt

↓

Groq API

↓

Generated Answer

Example models:

- Llama models
- Mixtral models

---

# 11. Day 36 Project Structure

```
day36_rag

├── notes
│   └── day36_notes.md
│
├── data
│   └── documents.json
│
├── embeddings
│   └── generate.js
│
├── vector-db
│   └── vectorStore.js
│
├── llm
│   └── groq.js
│
├── express-api
│   └── server.js
│
├── assignment
│   └── company_bot.js
│
├── .env
└── README.md
```

---

# 12. Complete Day 36 Pipeline

Question:

"What is Express.js?"

Step 1:

Convert question into embedding.

Step 2:

Search vector database.

Step 3:

Retrieve top matching documents.

Step 4:

Create prompt with context.

Step 5:

Send prompt to Groq.

Step 6:

Return final answer.

---

# 13. RAG Best Practices

## Chunk Documents

Avoid sending huge documents.

Recommended:

500-1000 tokens per chunk.

---

## Use Top-K Retrieval

Retrieve only useful documents.

Examples:

Top 3

Top 5

Avoid:

Top 100

---

## Add Metadata

Example:

```json
{
  "source": "company_policy.pdf",
  "page": 12
}
```

Benefits:

- Tracking sources
- Better filtering
- Debugging

---

## Cache Results

Use:

Redis

Benefits:

- Faster responses
- Reduced API cost

---

## Validate Answers

Never blindly trust LLM output.

Always verify with source documents.

---

# 14. Common RAG Mistakes

## Mistake 1

Sending entire PDF directly to LLM.

Solution:

Chunk documents first.

---

## Mistake 2

No embeddings.

Solution:

Use embedding models.

---

## Mistake 3

Wrong embedding model.

Question and documents should use the same embedding model.

---

## Mistake 4

Retrieving too many documents.

Solution:

Use Top-K retrieval.

---

## Mistake 5

No metadata.

Solution:

Store source information.

---

# DAY 36 INTERVIEW QUESTIONS AND ANSWERS

# Q1. What is RAG?

Answer:

RAG stands for Retrieval-Augmented Generation.

It is an AI architecture where relevant information is retrieved from external sources before generating an answer using an LLM.

It combines:

- Retrieval system
- Vector database
- LLM generation

---

# Q2. Why do we use RAG?

Answer:

RAG is used to reduce hallucinations and allow LLMs to answer using private or updated information.

Benefits:

- Access private documents
- Improve accuracy
- Reduce incorrect answers
- Add external knowledge

---

# Q3. What are the main components of RAG?

Answer:

A RAG system contains:

1. Document Loader

Loads documents.

2. Chunking System

Splits documents.

3. Embedding Model

Converts text into vectors.

4. Vector Database

Stores embeddings.

5. Retriever

Finds relevant documents.

6. Prompt Builder

Creates final prompt.

7. LLM

Generates answer.

---

# Q4. What are embeddings?

Answer:

Embeddings are numerical representations of text.

They convert human language into vectors that machines can compare.

Similar meanings create similar vectors.

---

# Q5. What is a vector database?

Answer:

A vector database stores embedding vectors and allows similarity search.

Examples:

- Pinecone
- Qdrant
- Chroma
- Weaviate
- Milvus

---

# Q6. What is semantic search?

Answer:

Semantic search finds documents based on meaning instead of exact keyword matching.

It understands the relationship between words and concepts.

---

# Q7. What is context injection?

Answer:

Context injection is adding retrieved information into the LLM prompt before generating the answer.

It helps the LLM answer using trusted information.

---

# Q8. How does RAG reduce hallucination?

Answer:

RAG provides external context from trusted documents.

The LLM generates answers based on retrieved information instead of only relying on training data.

---

# Q9. Can RAG work without a vector database?

Answer:

Yes.

For small datasets, an in-memory array can be used.

For production applications, vector databases are preferred because they provide faster and scalable search.

---

# Q10. What is Top-K retrieval?

Answer:

Top-K retrieval means selecting the K most similar documents from the vector database.

Example:

Top-K = 3

means retrieve the 3 most relevant documents.

---

# Q11. What is chunking?

Answer:

Chunking is splitting large documents into smaller pieces before generating embeddings.

It improves retrieval quality and reduces token usage.

---

# Q12. What companies use RAG?

Answer:

Many AI products use RAG concepts, including:

- AI assistants
- Documentation bots
- Enterprise search systems
- Customer support bots

---

# Q13. Difference between fine-tuning and RAG?

Answer:

Fine-tuning:

- Changes model weights
- Requires training
- Expensive

RAG:

- Keeps model unchanged
- Adds external knowledge
- Easier to update

---

# Q14. Explain Day 36 project flow.

Answer:

User asks question.

↓

Question converted into embedding.

↓

Vector database searches similar documents.

↓

Relevant documents are retrieved.

↓

Context is added to prompt.

↓

Groq LLM generates final answer.

---
