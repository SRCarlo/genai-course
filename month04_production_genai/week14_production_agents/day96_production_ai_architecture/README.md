# Day 96 - Production AI Application Architecture

## Overview

Day 96 focuses on designing a production-ready AI application architecture.

The purpose of this project is to understand how an AI application can be structured into independent and maintainable layers such as API, application services, AI services, database, security, caching, queues, and observability.

## Technology Stack

- Node.js
- Express.js
- JavaScript
- Zod
- Groq API
- GPT-OSS-20B
- OpenAI-compatible SDK

## AI Provider

This project uses Groq as the AI provider.

Model:

```text
openai/gpt-oss-20b
```

The application uses the OpenAI-compatible SDK with the Groq API endpoint.

The LLM provider implementation is isolated inside the provider adapter so that the AI provider can be replaced without changing the application or agent logic.

## Architecture

```text
Client
   |
   v
API
   |
   v
Authentication
   |
   v
Rate Limiting
   |
   v
Validation
   |
   v
Controller
   |
   v
Application Service
   |
   v
AI Agent
   |
   +------> Memory
   |
   +------> RAG
   |
   +------> Tools
   |
   v
LLM Service
   |
   v
Provider Adapter
   |
   v
Groq API
   |
   v
openai/gpt-oss-20b
   |
   v
Response
```

## Project Structure

```text
day96_production_ai_architecture/
|
├── src/
│   |
│   ├── api/
│   │   ├── routes/
│   │   │   └── chat.routes.js
│   │   ├── controllers/
│   │   │   └── chat.controller.js
│   │   └── middleware/
│   │       ├── auth.js
│   │       ├── rateLimit.js
│   │       ├── validate.js
│   │       └── errorHandler.js
│   |
│   ├── application/
│   │   └── chat.service.js
│   |
│   ├── ai/
│   │   ├── agents/
│   │   │   └── support.agent.js
│   │   ├── llm/
│   │   │   ├── llm.service.js
│   │   │   └── provider.adapter.js
│   │   ├── rag/
│   │   │   ├── retriever.js
│   │   │   └── context.builder.js
│   │   ├── memory/
│   │   │   └── memory.service.js
│   │   ├── tools/
│   │   │   └── tool.registry.js
│   │   └── guardrails/
│   │       └── input.guard.js
│   |
│   ├── domain/
│   │   ├── users/
│   │   │   └── user.repository.js
│   │   ├── conversations/
│   │   │   └── conversation.repository.js
│   │   └── documents/
│   │       └── document.repository.js
│   |
│   ├── infrastructure/
│   │   ├── database/
│   │   │   └── database.js
│   │   ├── cache/
│   │   │   └── cache.js
│   │   ├── queue/
│   │   │   └── queue.js
│   │   └── observability/
│   │       └── logger.js
│   |
│   ├── config/
│   │   └── config.js
│   |
│   ├── app.js
│   └── server.js
|
├── tests/
│   ├── api.test.js
│   ├── auth.test.js
│   ├── agent.test.js
│   └── architecture.test.js
|
├── notes/
│   └── day96_notes.md
|
├── assignment/
│   └── day96_assignment.md
|
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Installation

Install the project dependencies:

```bash
npm install
```

## Environment Configuration

Create a `.env` file in the project root.

```env
PORT=3000
NODE_ENV=development

GROQ_API_KEY=your_groq_api_key

GROQ_MODEL=openai/gpt-oss-20b

MAX_TOKENS=1000
MAX_ITERATIONS=8
MAX_TOOL_CALLS=10
MAX_EXECUTION_MS=15000

RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

Do not commit the `.env` file to Git.

## Run the Application

Run the application in development mode:

```bash
npm run dev
```

Run the application normally:

```bash
npm start
```

The application will run on:

```text
http://localhost:3000
```

## Health Check

Request:

```http
GET /health
```

Response:

```json
{
  "status": "ok"
}
```

## Liveness Check

Request:

```http
GET /health/live
```

Response:

```json
{
  "status": "ok"
}
```

## Readiness Check

Request:

```http
GET /health/ready
```

Response:

```json
{
  "status": "ready",
  "environment": "development"
}
```

## Chat API

Endpoint:

```http
POST /api/chat
```

Headers:

```text
Content-Type: application/json
x-user-id: user-123
x-tenant-id: tenant-123
```

Request body:

```json
{
  "message": "What is your refund policy?"
}
```

## Request Flow

```text
POST /api/chat
       |
       v
Authentication
       |
       v
Rate Limiting
       |
       v
Input Validation
       |
       v
Chat Controller
       |
       v
Chat Service
       |
       v
Support Agent
       |
       +------> Memory
       |
       +------> RAG
       |
       +------> Tools
       |
       v
LLM Service
       |
       v
Groq Provider Adapter
       |
       v
Groq API
       |
       v
openai/gpt-oss-20b
       |
       v
Response
```

## RAG

The project contains a RAG layer for retrieving relevant information before generating the response.

```text
User Query
    |
    v
Retriever
    |
    v
Relevant Documents
    |
    v
Context Builder
    |
    v
LLM
    |
    v
Response
```

Tenant isolation is applied during document retrieval.

## Memory

The memory service stores recent conversation messages for the user.

The amount of stored memory is limited to prevent unlimited context growth.

## Tools

The project includes a tool registry.

Tools are registered separately from the agent and can be accessed through controlled application logic.

## Authentication and Authorization

Authentication identifies the user.

Authorization determines what the user is allowed to access or execute.

The project also includes tenant isolation so that one tenant cannot access another tenant's documents.

## Rate Limiting

The API includes request rate limiting.

When the request limit is exceeded, the API returns:

```text
429 Too Many Requests
```

## Error Handling

Errors are handled through a centralized error handler.

Internal stack traces are not returned to the client.

## Caching

A cache abstraction is included in the infrastructure layer.

The cache can later be replaced with Redis or another distributed caching system.

## Queue

A queue abstraction is included for asynchronous workloads.

It can later be replaced with BullMQ, Redis Queue, AWS SQS, or another production queue system.

## Observability

The project includes structured logging.

Production systems can extend this with:

- Logs
- Metrics
- Traces
- Alerts

AI-specific information can include:

- Request ID
- Agent ID
- Model
- Latency
- Token usage
- Retrieval information
- Errors

## Testing

Run the test suite:

```bash
npm test
```

The project contains tests for:

- API
- Authentication
- Agent guardrails
- Architecture

## Production Improvements

For a production deployment, the following components can be replaced or extended:

- PostgreSQL or MongoDB
- Redis
- BullMQ
- Production vector database
- JWT or OAuth authentication
- Distributed rate limiting
- OpenTelemetry
- Centralized logging
- Metrics system
- Secret manager
- Load balancer
- Multiple API instances
- Background workers

## Git

Initialize Git:

```bash
git init
```

Add files:

```bash
git add .
```

Create the initial commit:

```bash
git commit -m "feat(day96): initialize production ai architecture"
```

## Day 96 Goal

The main goal of Day 96 is to understand that a production AI application is not only an LLM.

A complete AI application requires:

```text
API
+
Application Layer
+
AI Layer
+
Security
+
Database
+
Vector Store
+
Cache
+
Queue
+
Observability
+
Reliability
```

The LLM is one component of the complete production architecture.
