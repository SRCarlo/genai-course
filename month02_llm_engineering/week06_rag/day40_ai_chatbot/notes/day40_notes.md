# Day 40 Notes

# Build a Production AI Chatbot

---

# Chatbot Architecture

User

↓

Frontend

↓

Express Server

↓

Controller

↓

Memory

↓

Retriever (RAG)

↓

Prompt Template

↓

Groq LLM

↓

Response

---

# Folder Structure

```
config/
controllers/
routes/
memory/
prompts/
rag/
data/
assignment/
notes/
```

---

# Express

Express is used to expose REST APIs.

Example endpoints

POST /chat

GET /history

POST /clear-history

GET /health

---

# LangChain

LangChain helps developers build LLM applications.

Benefits

- Prompt Templates
- Memory
- Chains
- Retrieval
- Agents

---

# Groq

Groq provides extremely fast inference for open-source LLMs.

Example model

```
llama-3.3-70b-versatile
```

---

# Memory

Memory stores previous conversations.

Development

```
Array
```

Production

```
Redis

Database

Vector Database
```

---

# Prompt Template

Example

```text
System Prompt

Context:
{context}

History:
{history}

Question:
{question}

Answer:
```

Prompt templates improve response quality.

---

# RAG

RAG means

Retrieval Augmented Generation

Flow

Question

↓

Retrieve Documents

↓

Context

↓

LLM

↓

Answer

Benefits

- Reduces hallucination
- Uses external knowledge
- Keeps answers updated

---

# REST APIs

### POST /chat

Input

```json
{
  "message": "Explain LangChain"
}
```

Output

```json
{
  "success": true,
  "response": "LangChain is..."
}
```

---

### GET /history

Returns all conversation history.

---

### POST /clear-history

Removes stored messages.

---

### GET /health

Checks if server is running.

Example

```json
{
  "status": "Running"
}
```

---

# Error Handling

Always use

```javascript
try {
} catch (error) {}
```

Return proper HTTP status codes.

400 → Bad Request

404 → Not Found

500 → Internal Server Error

---

# Validation

Always validate

- message
- request body
- API keys

Never trust user input.

---

# Logging

Useful packages

```
morgan

winston

pino
```

Logging helps debug production applications.

---

# Production Improvements

- Redis Memory
- JWT Authentication
- Rate Limiting
- Docker
- Kubernetes
- Qdrant
- Pinecone
- ChromaDB
- LangSmith
- Monitoring
- CI/CD

---

# Interview Questions

## What is LangChain?

A framework for building LLM-powered applications.

---

## What is RAG?

Retrieval Augmented Generation.

It retrieves external information before generating an answer.

---

## What is Prompt Engineering?

Designing prompts that guide the LLM to produce better responses.

---

## Why use Memory?

To remember previous conversations and maintain context.

---

## Why use Express?

To expose AI functionality through REST APIs.

---

## What is a Health Endpoint?

An endpoint that checks whether the application is running.

---

## How is Memory stored in Production?

- Redis
- SQL Database
- MongoDB
- Vector Database

---

## What is a System Prompt?

Instructions that define the chatbot's behavior.

---

# Key Takeaways

- Built a production-style AI chatbot.
- Connected Groq with LangChain.
- Implemented REST APIs.
- Added conversation memory.
- Used prompt templates.
- Added simple RAG.
- Implemented health endpoint.
- Improved application structure.
- Prepared foundation for advanced AI applications.
