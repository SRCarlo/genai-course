# Architecture — Company Knowledge Agent

## 1. Overview

The application is a production-style Agentic RAG knowledge assistant built with Node.js and Express.

## 2. High-Level Architecture

```text
CLIENT
  |
  v
EXPRESS API
  |
  v
REQUEST VALIDATION
  |
  v
AI AGENT
  |
  +----------------+----------------+
  |                |                |
  v                v                v
MEMORY            RAG          CALCULATOR
                   |
                   v
              EMBEDDINGS
                   |
                   v
              VECTOR DB
                   |
                   v
              RETRIEVAL
  |                |                |
  +----------------+----------------+
                   |
                   v
             AGENT REASONING
                   |
                   v
            GROUNDED ANSWER
                   |
                   v
             SOURCES + TRACE
```

## 3. Backend Structure

```text
backend/
├── agent/
│   ├── agent.js
│   ├── reactLoop.js
│   ├── planner.js
│   └── state.js
├── tools/
│   ├── calculatorTool.js
│   ├── ragSearchTool.js
│   └── toolRegistry.js
├── rag/
│   ├── retriever.js
│   ├── queryRewriter.js
│   ├── contextBuilder.js
│   └── sourceTracker.js
├── memory/
│   └── conversationMemory.js
├── embeddings/
│   └── embeddingService.js
├── vectorstore/
│   └── vectorStore.js
├── services/
│   └── llmService.js
├── controllers/
│   └── agentController.js
├── routes/
│   └── agentRoutes.js
├── middleware/
│   ├── errorHandler.js
│   └── validateRequest.js
├── data/
│   ├── documents/
│   └── chunks/
└── tests/
```

## 4. Agent Flow

The ReAct loop repeatedly:

1. Reads the current state.
2. Asks the LLM what action is required.
3. Selects either a tool or final answer.
4. Executes the selected tool.
5. Stores the observation.
6. Updates state.
7. Repeats until a final answer is produced or a safety limit is reached.

## 5. RAG Flow

```text
Document
  ↓
Load
  ↓
Chunk
  ↓
Embedding
  ↓
Vector DB

Question
  ↓
Query Rewrite
  ↓
Embedding
  ↓
Vector Search
  ↓
Top-K Chunks
  ↓
Context Builder
  ↓
Agent
```

## 6. Memory

Conversation memory stores messages by `sessionId`. Follow-up questions can be rewritten into standalone queries before retrieval.

## 7. Production Guardrails

- Maximum iterations
- Maximum tool calls
- Maximum RAG calls
- Input validation
- Timeouts
- Token limits
- Error handling
- Secret management
- Prompt-injection awareness
- Authorization before document retrieval

## 8. Security Principle

The LLM must not become the security boundary. Authentication and authorization should determine which documents the user is allowed to retrieve before RAG access is performed.
