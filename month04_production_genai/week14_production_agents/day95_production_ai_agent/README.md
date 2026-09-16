# Production AI Support Agent — Day 95

A production-oriented customer support agent built with Node.js, Express, Zod, and Groq using `openai/gpt-oss-20b`.

## Important: Groq instead of OpenAI

This project does **not** require an OpenAI API key.

It uses:

- `groq-sdk`
- `GROQ_API_KEY`
- `MODEL_NAME=openai/gpt-oss-20b`

Groq's API supports OpenAI-compatible interfaces, and GPT-OSS 20B supports tool use and reasoning.

## Features

- Agent planning
- Multi-domain routing: research, order, customer
- Controlled tool registry
- Zod tool validation
- Permission checks
- Business rules
- Short-term memory
- Groq LLM response generation
- Retry handling
- Structured logs
- Trace IDs and spans
- Latency metrics
- Evaluation dataset
- Safety dataset
- Regression dataset
- Unit tests
- REST API

## Architecture

```text
Client
  |
  v
REST API
  |
  v
Support Agent
  |
  +--> Planner
  +--> Memory
  +--> Policy
  |
  v
Tool Executor
  |
  +--> Order Tool
  +--> Knowledge Tool
  +--> Customer Tool
  +--> Update Customer Tool
  |
  v
Tool Result
  |
  v
Groq / openai/gpt-oss-20b
  |
  v
Final Answer
  |
  +--> Evaluation
  +--> Observability
```

## Setup

```bash
npm install
```

Copy `.env.example` to `.env` and add your Groq API key.

```env
GROQ_API_KEY=your_key_here
MODEL_NAME=openai/gpt-oss-20b
PORT=3000
GROQ_REASONING_EFFORT=medium
GROQ_MAX_COMPLETION_TOKENS=800
```

## Run

```bash
npm start
```

Development:

```bash
npm run dev
```

## API

Health:

```http
GET /api/health
```

Tools:

```http
GET /api/tools
```

Metrics:

```http
GET /api/metrics
```

Chat:

```http
POST /api/chat
Content-Type: application/json
```

Body:

```json
{
  "message": "What is the status of ORD-1001?",
  "role": "user",
  "customerId": "CUST-001",
  "sessionId": "demo-session"
}
```

Authenticated customer update:

```json
{
  "message": "Update CUST-001 email to new@example.com",
  "role": "authenticated-user",
  "customerId": "CUST-001",
  "sessionId": "demo-session"
}
```

## Test

```bash
npm test
```

## Evaluation

```bash
npm run evaluate
```

## Notes

The mock tools are intentionally simple. For real production use, replace them with authenticated service/database calls and add real identity, rate limiting, persistent memory, secret management, distributed tracing, and idempotency for side-effecting operations.
