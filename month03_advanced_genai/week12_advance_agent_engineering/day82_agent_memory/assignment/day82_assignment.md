# Day 82 — Personal AI Memory Agent

A production-oriented learning project demonstrating
short-term, long-term, semantic and episodic memory
for AI agents.

## Tech Stack

- Node.js
- Express.js
- Groq API
- GPT-OSS 20B
- JavaScript
- In-memory Map storage

## Model

openai/gpt-oss-20b

## Features

- Short-term memory
- Long-term memory
- Semantic memory
- Episodic memory
- Memory retrieval
- Context injection
- Memory extraction
- Structured memory output
- Memory validation
- Sensitive-data filtering
- Deduplication
- Memory expiration
- User isolation
- Memory deletion

## Run

Install dependencies:

npm install

Create `.env`:

GROQ_API_KEY=your_key
PORT=3000

Start:

npm run dev

## API

POST /api/chat/:userId

GET /api/memory/:userId

DELETE /api/memory/:userId/:memoryId

DELETE /api/memory/:userId

GET /health
