# Day 82 - Agent Memory

## Overview

This project implements a memory-enabled AI agent using Node.js, Express, and Groq.

The agent can store and retrieve information from previous conversations and use relevant memories when generating responses.

## Features

- Short-term memory
- Long-term memory
- Conversation memory
- Semantic memory
- Episodic memory
- Memory retrieval
- Memory context building
- Memory extraction
- Memory validation
- Memory consolidation
- User-specific memory
- Memory expiration support
- Groq LLM integration

## Project Structure

```text
day82_agent_memory/
│
├── src/
│   ├── agents/
│   │   └── memory.agent.js
│   │
│   ├── memory/
│   │   ├── context.builder.js
│   │   ├── episodic.memory.js
│   │   ├── long.term.memory.js
│   │   ├── memory.consolidator.js
│   │   ├── memory.extractor.js
│   │   ├── memory.manager.js
│   │   ├── memory.retriever.js
│   │   ├── memory.types.js
│   │   ├── memory.validator.js
│   │   ├── semantic.memory.js
│   │   └── short.term.memory.js
│   │
│   ├── services/
│   │   └── llm.service.js
│   │
│   ├── routes/
│   │   └── memory.routes.js
│   │
│   ├── storage/
│   │   └── memory.store.js
│   │
│   ├── app.js
│   └── server.js
│
├── tests/
│   ├── memory.test.js
│   └── retriever.test.js
│
├── assignment/
│   └── day82_assignment.md
│
├── notes/
│   └── day82_notes.md
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Technologies

- Node.js
- JavaScript
- Express.js
- Groq SDK
- GPT-OSS-20B
- Node.js Test Runner

## Installation

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
GROQ_API_KEY=your_api_key
PORT=3000
```

## Run the Project

Start the development server:

```bash
npm run dev
```

Server:

```text
http://localhost:3000
```

## API

### Chat

```http
POST /api/chat/:userId
```

Example:

```bash
curl -X POST http://localhost:3000/api/chat/user123 \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"What backend stack should I use?\"}"
```

Example request:

```json
{
  "message": "What backend stack should I use?"
}
```

## Memory Flow

```text
User
 ↓
Memory Retrieval
 ↓
Relevant Memories
 ↓
Context Builder
 ↓
LLM
 ↓
Response
 ↓
Memory Extraction
 ↓
Validation
 ↓
Memory Storage
```

## Testing

Run tests:

```bash
npm test
```

Tests cover:

- Short-term memory
- Long-term memory
- User isolation
- Memory deletion
- Memory retrieval

## Memory Example

```json
{
  "id": "memory-id",
  "userId": "user123",
  "type": "preference",
  "content": "User prefers Node.js",
  "importance": 0.9,
  "source": "conversation",
  "createdAt": "2026-09-03T06:20:58.288Z"
}
```

## Production Considerations

A production memory system should include:

- User authentication
- Authorization
- User isolation
- Memory validation
- Memory deduplication
- Memory expiration
- Sensitive data protection
- Persistent database
- Vector search
- Retrieval limits
- Logging and monitoring

```

## Key Principle

Store useful information, retrieve only relevant information, validate memory before storing it, and never treat raw LLM output as trusted data.
```
