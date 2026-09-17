# Day 96 - Production AI Application Architecture

## Objective

Build a production-style AI application architecture using Node.js, Express.js, Groq API, and GPT-OSS-20B.

The objective is to understand how to structure an AI application using separate layers for API, application logic, AI functionality, infrastructure, security, and observability.

## Technology Stack

Use the following technologies:

- Node.js
- Express.js
- JavaScript
- Zod
- Groq API
- GPT-OSS-20B
- OpenAI-compatible SDK

## AI Provider

Use Groq as the AI provider.

Model:

```text
openai/gpt-oss-20b
```

The Groq API key must be stored in the `.env` file.

Do not hard-code the API key inside the source code.

## Project Structure

Create the following structure:

```text
day96_production_ai_architecture/
|
├── src/
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
│   │
│   ├── application/
│   │   └── chat.service.js
│   │
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
│   │
│   ├── domain/
│   │   ├── users/
│   │   │   └── user.repository.js
│   │   ├── conversations/
│   │   │   └── conversation.repository.js
│   │   └── documents/
│   │       └── document.repository.js
│   │
│   ├── infrastructure/
│   │   ├── database/
│   │   │   └── database.js
│   │   ├── cache/
│   │   │   └── cache.js
│   │   ├── queue/
│   │   │   └── queue.js
│   │   └── observability/
│   │       └── logger.js
│   │
│   ├── config/
│   │   └── config.js
│   │
│   ├── app.js
│   └── server.js
│
├── tests/
│   ├── api.test.js
│   ├── auth.test.js
│   ├── agent.test.js
│   └── architecture.test.js
│
├── notes/
│   └── day96_notes.md
│
├── assignment/
│   └── day96_assignment.md
│
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

# Level 1 - Basic

## Task 1 - Express API

Create an Express.js application.

The application must run on:

```text
http://localhost:3000
```

## Task 2 - Controller

Create:

```text
src/api/controllers/chat.controller.js
```

The controller must:

- Read request data
- Read authenticated user information
- Call the chat service
- Return the response
- Pass errors to the error handler

## Task 3 - Application Service

Create:

```text
src/application/chat.service.js
```

The service must contain the application workflow.

The controller should not contain the complete AI workflow.

## Task 4 - AI Agent

Create:

```text
src/ai/agents/support.agent.js
```

The agent must process the user request and call the LLM service.

## Task 5 - Error Handler

Create:

```text
src/api/middleware/errorHandler.js
```

Implement centralized error handling.

Do not expose internal stack traces to the client.

## Task 6 - Health Endpoint

Create:

```http
GET /health
```

Expected response:

```json
{
  "status": "ok"
}
```

## Task 7 - Environment Configuration

Create:

```text
.env
.env.example
```

Use:

```env
PORT=3000
NODE_ENV=development

GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-20b
```

# Level 2 - Intermediate

## Task 8 - Authentication

Create:

```text
src/api/middleware/auth.js
```

The middleware must identify the current user.

For learning purposes, a temporary user object can be used.

Example:

```javascript
req.user = {
  id: "user-123",
  tenantId: "tenant-123",
  role: "user",
};
```

## Task 9 - Input Validation

Create:

```text
src/api/middleware/validate.js
```

Use Zod to validate the chat request.

Request:

```json
{
  "message": "Hello"
}
```

The message must:

- Be required
- Be a string
- Have a maximum length

## Task 10 - LLM Abstraction

Create:

```text
src/ai/llm/llm.service.js
src/ai/llm/provider.adapter.js
```

Implement the following architecture:

```text
Application
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
```

The agent must not directly call the Groq API.

## Task 11 - Tool Registry

Create:

```text
src/ai/tools/tool.registry.js
```

Create at least one tool.

Example:

```text
get_order_status
```

The tool should return order information.

## Task 12 - Memory Service

Create:

```text
src/ai/memory/memory.service.js
```

The memory service should:

- Store recent messages
- Retrieve recent messages
- Limit the amount of stored memory
- Allow memory to be cleared

## Task 13 - RAG

Create:

```text
src/ai/rag/retriever.js
src/ai/rag/context.builder.js
```

The retriever should find relevant documents.

The context builder should prepare retrieved documents for the LLM.

## Task 14 - Structured Logging

Create:

```text
src/infrastructure/observability/logger.js
```

Log:

- Request ID
- User ID
- Tenant ID
- Agent ID
- Model
- Latency
- Token usage
- Errors

## Task 15 - Rate Limiting

Create:

```text
src/api/middleware/rateLimit.js
```

Implement request rate limiting.

When the limit is exceeded, return:

```text
429 Too Many Requests
```

# Level 3 - Advanced

## Task 16 - Production AI Architecture

Implement the following request flow:

```text
Frontend
    |
    v
API
    |
    v
Authentication
    |
    v
Authorization
    |
    v
Rate Limiting
    |
    v
Input Validation
    |
    v
AI Application Service
    |
    v
Agent
    |
    +------> RAG
    |
    +------> Memory
    |
    +------> Tools
    |
    +------> LLM
               |
               v
             Groq
               |
               v
      openai/gpt-oss-20b
    |
    v
Guardrails
    |
    v
Response
```

## Task 17 - Database Boundary

Create:

```text
src/infrastructure/database/database.js
```

The database abstraction should support application data such as:

- Users
- Conversations
- Documents
- Messages

The initial implementation can use in-memory storage.

The architecture should allow the implementation to be replaced later with PostgreSQL, MongoDB, MySQL, or another database.

## Task 18 - Vector Store Boundary

The RAG layer must be separated from the main application database.

The vector store should be responsible for semantic retrieval.

The initial implementation can use in-memory sample documents.

## Task 19 - Cache

Create:

```text
src/infrastructure/cache/cache.js
```

Implement:

- Get
- Set
- Delete
- Clear

The cache must support expiration.

## Task 20 - Queue

Create:

```text
src/infrastructure/queue/queue.js
```

Implement a basic queue abstraction.

The queue should support asynchronous tasks such as:

- Document processing
- Embedding generation
- Report generation
- Batch evaluation

## Task 21 - Tenant Isolation

Ensure that documents are filtered using the current user's tenant ID.

Example:

```javascript
const filters = {
  tenantId: currentUser.tenantId,
};
```

A user from one tenant must not retrieve another tenant's documents.

## Task 22 - Guardrails

Create:

```text
src/ai/guardrails/input.guard.js
```

Implement basic input protection.

The application should:

- Reject empty messages
- Limit message length
- Reject unsafe system-instruction extraction attempts
- Prevent uncontrolled input growth

## Task 23 - Agent Limits

Define execution limits for the agent.

Example:

```javascript
const budget = {
  maxIterations: 8,
  maxToolCalls: 10,
  maxTokens: 12000,
  maxExecutionMs: 15000,
};
```

These limits should prevent:

- Infinite agent loops
- Excessive tool calls
- Excessive token usage
- Long-running execution

## Task 24 - Health Checks

Implement:

```http
GET /health
GET /health/live
GET /health/ready
```

Liveness should determine whether the process is running.

Readiness should determine whether the application is ready to serve requests.

# Security Requirements

The application must implement:

## Authentication

Identify the user making the request.

## Authorization

Determine whether the user is allowed to perform the requested operation.

## Tenant Isolation

Ensure that users cannot access another tenant's data.

## Input Validation

Validate all API input.

## Tool Authorization

Do not provide the LLM with unrestricted access to infrastructure.

## Secrets Management

Never hard-code:

```javascript
const apiKey = "gsk_xxxxx";
```

Use:

```javascript
process.env.GROQ_API_KEY;
```

# API Requirements

Implement:

```http
POST /api/chat
```

Headers:

```text
Content-Type: application/json
x-user-id: user-123
x-tenant-id: tenant-123
```

Request:

```json
{
  "message": "What is your refund policy?"
}
```

Expected processing flow:

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
Validation
        |
        v
Controller
        |
        v
Chat Service
        |
        v
Support Agent
        |
        +------ Memory
        |
        +------ RAG
        |
        +------ Tools
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

# Testing Requirements

Create:

```text
tests/api.test.js
tests/auth.test.js
tests/agent.test.js
tests/architecture.test.js
```

Run:

```bash
npm test
```

Tests should verify:

- Health endpoint
- Authentication middleware
- Input validation
- Guardrails
- Agent structure
- LLM service
- Chat service
- Architecture boundaries

# Documentation Requirements

Create:

```text
README.md
notes/day96_notes.md
assignment/day96_assignment.md
```

The README should contain:

- Project overview
- Technology stack
- Architecture
- Project structure
- Installation
- Environment configuration
- API documentation
- Testing
- Production improvements

The notes file should contain:

- Production AI applications
- Monolithic architecture
- Modular monolith
- API architecture
- Controllers
- Services
- AI layer
- LLM abstraction
- Groq integration
- Database architecture
- Vector database
- RAG
- Queues
- Background workers
- Caching
- Rate limiting
- Token limits
- Agent budgets
- Authentication
- Authorization
- Tenant isolation
- Secrets management
- Configuration
- Health checks
- Observability
- Error handling
- Scalability
- Stateless APIs

# Final Checklist

## API

- [ ] Express API
- [ ] Routes
- [ ] Controllers
- [ ] Application service
- [ ] Input validation
- [ ] Error handler
- [ ] Health endpoint
- [ ] Liveness endpoint
- [ ] Readiness endpoint

## AI

- [ ] Agent
- [ ] LLM service
- [ ] Groq provider adapter
- [ ] GPT-OSS-20B
- [ ] RAG
- [ ] Memory
- [ ] Tools
- [ ] Guardrails

## Security

- [ ] Authentication
- [ ] Authorization
- [ ] Tenant isolation
- [ ] Input validation
- [ ] Tool authorization
- [ ] Environment-based secrets
- [ ] Rate limiting

## Infrastructure

- [ ] Database boundary
- [ ] Vector store boundary
- [ ] Cache
- [ ] Queue
- [ ] Worker architecture

## Observability

- [ ] Structured logs
- [ ] Metrics architecture
- [ ] Tracing architecture
- [ ] Error tracking
- [ ] Alerting architecture

## Testing

- [ ] API tests
- [ ] Authentication tests
- [ ] Agent tests
- [ ] Architecture tests

# Final Architecture

```text
                         USERS
                           |
                           v
                       FRONTEND
                           |
                           v
                     LOAD BALANCER
                           |
                           v
                   AUTHENTICATION
                           |
                           v
                    RATE LIMITING
                           |
                           v
                     VALIDATION
                           |
                           v
                     CONTROLLER
                           |
                           v
                APPLICATION SERVICE
                           |
                           v
                         AGENT
                           |
             +-------------+-------------+
             |             |             |
             v             v             v
          MEMORY          RAG          TOOLS
             |             |             |
             v             v             v
         DATABASE     VECTOR STORE    SERVICES
                           |
                           v
                      LLM SERVICE
                           |
                           v
                   PROVIDER ADAPTER
                           |
                           v
                         GROQ
                           |
                           v
                  openai/gpt-oss-20b
                           |
                           v
                      GUARDRAILS
                           |
                           v
                       RESPONSE

Infrastructure:

Database
Vector Store
Cache
Queue
Workers

Observability:

Logs
Metrics
Traces
Alerts
```

# Expected Outcome

By completing Day 96, the application should demonstrate a clear separation between:

```text
API Layer
Application Layer
AI Layer
Domain Layer
Infrastructure Layer
Configuration Layer
```

The application should use Groq with:

```text
openai/gpt-oss-20b
```

and should demonstrate how an AI agent can be integrated into a production-style application architecture.
