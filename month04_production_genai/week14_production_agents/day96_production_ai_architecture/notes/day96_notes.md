# Day 96 - Production AI Application Architecture

## 1. Production AI Application

A production AI application is the complete software system built around AI functionality.

It includes:

- API
- Authentication
- Authorization
- Application logic
- AI layer
- Database
- Vector store
- Cache
- Queue
- Workers
- Observability
- Error handling
- Security

## 2. AI Agent vs AI Application

An AI agent is one component of a complete AI application.

A production application contains:

```text
Frontend
   |
   v
API
   |
   v
Application Layer
   |
   v
AI Layer
   |
   v
LLM
   |
   v
Infrastructure
```

## 3. Monolithic Architecture

A monolithic application keeps multiple components inside one deployable application.

Example:

```text
src/
├── routes/
├── controllers/
├── services/
├── models/
├── ai/
└── app.js
```

A monolith is often a suitable starting point for a small application.

## 4. Modular Monolith

A modular monolith is a single deployable application organized into clearly separated modules.

Example:

```text
src/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── chat/
│   ├── agents/
│   ├── rag/
│   └── billing/
│
├── infrastructure/
│   ├── database/
│   ├── cache/
│   ├── queue/
│   └── observability/
│
├── config/
└── app.js
```

## 5. API Architecture

The recommended request flow is:

```text
HTTP Request
     |
     v
Controller
     |
     v
Service
     |
     v
AI / Domain
     |
     v
Repository
     |
     v
Database
```

## 6. Controller

A controller handles HTTP-related responsibilities.

Responsibilities include:

- Reading request data
- Reading authenticated user information
- Calling application services
- Returning HTTP responses
- Passing errors to the error handler

The controller should not contain the complete AI workflow.

## 7. Service Layer

The service layer contains application-level workflows.

Example:

```text
Controller
    |
    v
Chat Service
    |
    v
Agent
    |
    v
LLM
```

## 8. AI Layer

The AI layer can contain:

- Agents
- Planner
- LLM
- RAG
- Memory
- Tools
- Guardrails
- Evaluation

Example:

```text
src/ai/
├── agents/
├── llm/
├── rag/
├── memory/
├── tools/
├── guardrails/
└── evaluation/
```

## 9. LLM Provider Abstraction

The application should not be tightly coupled to one AI provider.

Recommended architecture:

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
LLM Provider
```

This project uses:

```text
Groq API
    |
    v
openai/gpt-oss-20b
```

## 10. Groq Integration

The LLM provider is implemented using an OpenAI-compatible client.

The application configuration contains:

```text
GROQ_API_KEY
GROQ_MODEL=openai/gpt-oss-20b
```

The provider-specific implementation is located in:

```text
src/ai/llm/provider.adapter.js
```

The agent does not directly call the Groq API.

The flow is:

```text
Agent
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
```

## 11. Database Architecture

The normal application database can store:

- Users
- Conversations
- Messages
- Documents
- Agents
- Tool calls
- Evaluations
- Audit logs

The database is responsible for structured application data.

## 12. Vector Database

A vector store is used for semantic retrieval.

Conceptually:

```text
Query
  |
  v
Embedding
  |
  v
Similarity Search
  |
  v
Top-K Chunks
```

## 13. Database vs Vector Store

Normal database:

```text
Users
Conversations
Messages
Permissions
Documents
```

Vector store:

```text
Embeddings
Semantic Search
RAG Retrieval
```

They solve different problems.

## 14. RAG Architecture

RAG stands for Retrieval-Augmented Generation.

Architecture:

```text
User
  |
  v
Chat API
  |
  v
Query Service
  |
  v
Retriever
  |
  v
Vector Search
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

## 15. RAG Ingestion

A document ingestion pipeline can follow:

```text
Document
    |
    v
Loader
    |
    v
Cleaner
    |
    v
Chunker
    |
    v
Embedding
    |
    v
Vector Store
```

## 16. Synchronous Work

Synchronous operations are suitable for tasks that can finish quickly.

Examples:

- Chat
- Simple retrieval
- Quick tool calls

Architecture:

```text
User
  |
  v
API
  |
  v
Agent
  |
  v
Response
```

## 17. Asynchronous Work

Long-running operations should be moved outside the HTTP request lifecycle.

Examples:

- Document ingestion
- Large embedding jobs
- Report generation
- Batch evaluation
- Large data processing

Architecture:

```text
User
  |
  v
API
  |
  v
Queue
  |
  v
Worker
  |
  v
Long-running Task
```

## 18. Queue

Queues allow long-running work to be processed separately from the API.

Example:

```json
{
  "jobId": "job-123",
  "status": "queued"
}
```

## 19. Background Workers

Workers can process tasks such as:

```text
Load Document
      |
      v
Create Chunks
      |
      v
Generate Embeddings
      |
      v
Store in Vector Store
```

## 20. Caching

Caching can reduce repeated expensive operations.

Architecture:

```text
Request
   |
   v
Cache
   |
   +---- HIT ----> Response
   |
   +---- MISS
          |
          v
         LLM
          |
          v
        Cache
          |
          v
       Response
```

Do not blindly cache:

- User-specific information
- Time-sensitive information
- Personal information
- Dynamic tool results
- Authorization-sensitive information

## 21. Rate Limiting

Production APIs should have request limits.

Example:

```text
User
  |
  v
Rate Limit
  |
  v
100 requests per minute
```

When the limit is exceeded:

```text
429 Too Many Requests
```

## 22. Token Limits

AI applications should control:

- Maximum input tokens
- Maximum output tokens
- Maximum context size
- Maximum tool calls
- Maximum agent iterations

## 23. Agent Budget

An agent should have execution limits.

Example:

```javascript
const budget = {
  maxIterations: 8,
  maxToolCalls: 10,
  maxTokens: 12000,
  maxExecutionMs: 15000,
};
```

The exact values depend on the application.

## 24. Agent Loop Protection

Without execution limits:

```text
Agent
  |
  v
Tool
  |
  v
Agent
  |
  v
Tool
  |
  v
Infinite Loop
```

With limits:

```text
Agent
  |
  v
Iteration 1
  |
  v
Iteration 2
  |
  v
Iteration 3
  |
  v
Maximum Iterations
  |
  v
STOP
```

## 25. Authentication

Authentication answers:

```text
Who are you?
```

Typical flow:

```text
User
  |
  v
Login
  |
  v
Authentication
  |
  v
Access Token / Session
  |
  v
API
```

## 26. Authorization

Authorization answers:

```text
What are you allowed to do?
```

Example:

```text
Authenticated User
        |
        v
Authorization
        |
        v
Can this user execute the operation?
```

## 27. Tenant Isolation

Tenant isolation is important for SaaS applications.

Example:

```text
Company A
    |
    +-- Users
    +-- Documents
    +-- Conversations

Company B
    |
    +-- Users
    +-- Documents
    +-- Conversations
```

Company A must not access Company B data.

Retrieval must respect the tenant:

```javascript
const filters = {
  tenantId: currentUser.tenantId,
};
```

## 28. AI Security Boundary

A secure request flow is:

```text
User
  |
  v
Authentication
  |
  v
Authorization
  |
  v
Input Validation
  |
  v
Agent
  |
  v
Tool Authorization
  |
  v
Tool
```

The LLM should not have unlimited access to infrastructure.

## 29. Secrets Management

Never hard-code API keys.

Incorrect:

```javascript
const apiKey = "secret-key";
```

Correct:

```javascript
process.env.GROQ_API_KEY;
```

Production applications should use an appropriate secret-management solution.

## 30. Configuration

Configuration should be centralized.

Example:

```javascript
const config = {
  port,
  environment,
  model,
  maxTokens,
  maxIterations,
};
```

## 31. Environments

Typical environments are:

```text
Development
Testing
Staging
Production
```

## 32. Health Checks

A basic health endpoint is:

```http
GET /health
```

Response:

```json
{
  "status": "ok"
}
```

## 33. Liveness

Liveness determines whether the application process is alive.

Endpoint:

```http
GET /health/live
```

## 34. Readiness

Readiness determines whether the application is ready to serve traffic.

Endpoint:

```http
GET /health/ready
```

Readiness checks can include required dependencies.

## 35. Observability

Production systems require:

- Logs
- Metrics
- Traces
- Alerts

AI-specific observability can include:

- Request ID
- Trace ID
- Agent ID
- Model
- Tool
- Latency
- Token usage
- Retrieval
- Errors
- Evaluation score

## 36. Error Handling

Recommended architecture:

```text
Route
  |
  v
Controller
  |
  v
Service
  |
  v
Error
  |
  v
Global Error Handler
  |
  v
Safe HTTP Response
```

Internal stack traces should not be exposed to users.

## 37. API Contract

The frontend should communicate with a stable API.

Example:

```http
POST /api/chat
```

Request:

```json
{
  "message": "Where is my order?"
}
```

Response:

```json
{
  "answer": "Your order has shipped.",
  "conversationId": "conv-123"
}
```

The frontend does not need to know how the internal agent works.

## 38. Scalability

A small application can start with one Node.js instance.

```text
Users
  |
  v
Node.js
  |
  v
Database
```

A larger application may use:

```text
Users
  |
  v
Load Balancer
  |
  +---- API
  |
  +---- API
  |
  +---- API
         |
         v
      Database
         |
         v
       Cache
         |
         v
       Queue
         |
         v
      Workers
```

## 39. Stateless APIs

API instances should remain stateless where practical.

Instead of storing conversation state inside one API instance:

```text
API Instance
    |
    +-- Conversation State
```

use shared storage:

```text
API
  |
  v
Shared Database / Cache
```

## 40. AI Worker Scaling

Heavy AI jobs can be distributed across multiple workers.

```text
API
  |
  v
Queue
  |
  +---- Worker 1
  |
  +---- Worker 2
  |
  +---- Worker 3
```

## 41. Production Architecture

The complete architecture is:

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
                     API / SERVICE
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
```

## 42. Key Day 96 Rules

1. Routes handle HTTP.
2. Controllers handle request and response mapping.
3. Services handle application workflows.
4. AI modules handle AI-specific logic.
5. Infrastructure handles external systems.
6. Security boundaries must be explicit.
7. LLMs should not directly control infrastructure.
8. Long-running work should use queues and workers.
9. Tenant data must be isolated.
10. AI execution should have limits.
11. Secrets should never be hard-coded.
12. Production systems require observability.
13. API contracts should remain stable.
14. Components should have clear responsibilities.
