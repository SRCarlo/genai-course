# Day 80 — Multi-Agent Systems

A production-oriented multi-agent developer assistant.

## Stack

- Node.js
- Express
- Groq
- openai/gpt-oss-20b
- Zod
- Jest

## Architecture

USER
↓
SUPERVISOR
↓
RESEARCHER
↓
CODER
↓
REVIEWER
↓
AGGREGATOR
↓
USER

## Setup

Install dependencies:

npm install

Create:

.env

Add:

GROQ_API_KEY=your_key
GROQ_MODEL=openai/gpt-oss-20b

Run:

npm run dev

## API

POST /api/agent/run

Example:

{
"task": "Research JWT authentication, implement it in Node.js and review the implementation."
}

## Features

- Multi-agent orchestration
- Shared state
- Agent handoffs
- LLM supervisor
- Groq API
- GPT-OSS 20B
- Retry
- Timeout
- Maximum workflow steps
- Execution tracing
- Security review
- Aggregation
