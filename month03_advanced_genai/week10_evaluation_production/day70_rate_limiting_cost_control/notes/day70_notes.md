# DAY 70 — PRODUCTION GENAI API: RATE LIMITING, QUOTAS & COST CONTROL

## Overview

Day 70 adds production controls to the GenAI API.

The main question is:

> How much can a user, API key, or tenant consume from the AI system?

The major controls are:

- Rate limiting
- Request throttling
- User-level limits
- Tenant-level limits
- IP-based limits
- API-key limits
- Token quotas
- Daily quotas
- Monthly quotas
- Concurrent request limits
- Model-specific limits
- Prompt-size limits
- Agent iteration limits
- Token tracking
- Cost estimation
- Budget protection
- Abuse prevention

The production request flow is:

User
↓
Authentication
↓
Authorization
↓
Tenant Check
↓
Rate Limit
↓
Quota Check
↓
Cost / Model Check
↓
Input Validation
↓
RAG / Agent
↓
LLM
↓
Usage Tracking
↓
Cost Tracking
↓
Response

---

# 1. Rate Limiting

Rate limiting controls how frequently a client can make requests.

Example:

10 requests per minute

The first 10 requests are allowed.

The 11th request is rejected until the rate-limit window resets.

Rate limiting protects the API from:

- Abuse
- Accidental request storms
- Denial-of-service style traffic
- Excessive LLM usage
- Resource exhaustion
- Unexpected API costs

Example:

User
↓
Request 1
↓
Request 2
↓
...
↓
Request 10
↓
Allowed

Request 11
↓
429 Too Many Requests

---

# 2. Quota

A quota controls total consumption over a longer period.

Example:

100,000 tokens per month

Rate limit and quota are different.

Rate limit:

Controls speed.

Example:

60 requests per minute

Quota:

Controls total consumption.

Example:

2,000,000 tokens per month

Easy way to remember:

Rate limit = speed limit

Quota = total allowance

---

# 3. HTTP 429

When a client exceeds a rate limit or usage limit, the API can return:

HTTP 429 Too Many Requests

Example response:

{
"success": false,
"error": "rate_limit_exceeded",
"message": "Too many requests"
}

The API may also send:

Retry-After: 30

This tells the client to retry after approximately 30 seconds.

---

# 4. Types of Production Limits

A production GenAI API can enforce multiple limits.

IP limit
↓
User limit
↓
Tenant limit
↓
API-key limit
↓
Token quota
↓
Concurrency limit
↓
Model limit
↓
Budget limit

Example:

IP:

100 requests/minute

User:

50 requests/minute

Tenant:

1,000 requests/hour

Monthly token quota:

2,000,000 tokens

---

# 5. Why GenAI Needs Stronger Rate Limiting

A traditional API request may look like:

Request
↓
Database
↓
Response

A GenAI request can look like:

Request
↓
Prompt processing
↓
Embedding
↓
Vector database
↓
RAG
↓
LLM
↓
Tool
↓
LLM again
↓
Response

One API request can therefore trigger significant resource usage.

An attacker could send:

10,000 requests
↓
LLM
↓
Huge API bill

Therefore GenAI systems require:

Authentication

- Authorization
- Rate Limiting
- Quota
- Cost Control

  ***

# 6. In-Memory Rate Limiting

A simple learning implementation can use a JavaScript Map.

Example:

const requests = new Map();

The map stores request information for each user or IP.

Concept:

user_123
↓
request count
↓
10

This is useful for learning.

However, it is not suitable for a distributed production system.

---

# 7. Why In-Memory Rate Limiting Is Not Production Ready

Suppose the application has three servers:

Server A
Server B
Server C

Each server has its own memory.

Therefore:

User
↓
Server A
count = 1

User
↓
Server B
count = 1

User
↓
Server C
count = 1

The servers do not share the counter.

A distributed system needs centralized/shared state.

A common architecture is:

Server A
↓
Redis

Server B
↓
Redis

Server C
↓
Redis

Redis
↓
Shared counters

Redis is commonly used for:

- Rate-limit counters
- Short-term usage counters
- Distributed locks
- Temporary state

For production, use a well-tested Redis-compatible rate-limiting library or managed service instead of implementing distributed algorithms from scratch.

---

# 8. User-Level Rate Limiting

A user can have a specific rate limit.

Example:

Free user:

10 requests/minute

Pro user:

60 requests/minute

Enterprise user:

300 requests/minute

The server identifies the user using authenticated server-side identity.

Example:

userId = user_123

Then the rate limiter checks:

rate:user_123

If the counter exceeds the configured limit:

HTTP 429

---

# 9. Tenant-Level Rate Limiting

In a SaaS application, multiple users can belong to one tenant.

Example:

Tenant A
├── User 1
├── User 2
├── User 3
└── User 4

The tenant can have an aggregate limit.

Example:

Tenant A:

1,000 requests/hour

This is different from:

1,000 requests/hour per user

Tenant-level limits prevent one organization from consuming unlimited shared resources.

---

# 10. User + Tenant Rate Limiting

A strong SaaS system can enforce both limits.

Example:

User:

50 requests/minute

Tenant:

500 requests/minute

A request must pass both checks.

Request
↓
User limit
↓
Tenant limit
↓
Allowed

If either limit is exceeded:

429 Too Many Requests

---

# 11. API-Key Rate Limiting

Some APIs use API keys instead of user sessions.

Example:

API key:

sk_demo_123

The system can track:

rate:api_key:sk_demo_123

This is useful for:

- Server-to-server APIs
- Developer APIs
- Programmatic integrations
- Service accounts

API keys should never be treated as permission to bypass tenant or budget controls.

---

# 12. IP-Based Rate Limiting

Public endpoints often use IP-based rate limiting.

Example:

100 requests/minute per IP

This helps protect:

- Login endpoints
- Registration endpoints
- Public APIs
- Health-related expensive endpoints

For authenticated AI APIs, IP alone is usually not enough.

Use authenticated identity such as:

userId
tenantId
apiKey

depending on the endpoint.

---

# 13. Plan-Based Limits

A SaaS application may have:

FREE
PRO
ENTERPRISE

Example configuration:

FREE:

10 requests/minute
100,000 tokens/month

PRO:

60 requests/minute
2,000,000 tokens/month

ENTERPRISE:

300 requests/minute
20,000,000 tokens/month

The server determines the user's plan.

The client must not be trusted to choose its own plan.

---

# 14. Token Quotas

Request count alone is not enough for GenAI.

Consider:

Request A:

100 tokens

Request B:

100,000 tokens

Both requests count as one request.

But their cost can be dramatically different.

Therefore track:

Input tokens

- # Output tokens
  Total tokens

Example:

Input:

1,200

Output:

500

Total:

1,700

---

# 15. Usage Record

A production usage record can contain:

{
"requestId": "req_123",
"userId": "user_456",
"tenantId": "tenant_789",
"model": "openai/gpt-oss-20b",
"inputTokens": 1200,
"outputTokens": 500,
"totalTokens": 1700,
"timestamp": "2026-08-22T00:00:00.000Z"
}

Usage information can support:

- Billing
- Analytics
- Quotas
- Cost monitoring
- Abuse detection
- Reporting
- Budget alerts

---

# 16. Never Trust Client Usage

The client should not be able to send:

{
"monthlyTokens": 0
}

and expect the server to trust it.

Usage must be calculated from actual server-side LLM responses.

Correct flow:

Client
↓
API
↓
Groq
↓
Actual token usage
↓
Server records usage

The server is the source of truth.

---

# 17. JWT and Dynamic Usage

Do not store frequently changing usage information in a JWT.

Bad:

{
"userId": "123",
"monthlyTokens": 98000
}

Usage changes frequently.

A JWT is not a suitable source of truth for dynamic quotas.

Better:

JWT
↓
userId
↓
Server-side storage
↓
Current usage

---

# 18. Groq Model Configuration

This Day 70 implementation uses Groq.

The available model must be checked against the models available to the current Groq account.

The configured model used during this implementation is:

openai/gpt-oss-20b

The model should be configured in the environment or server-side configuration.

Example:

GROQ_MODEL=openai/gpt-oss-20b

Do not assume that an old model name such as:

llama-3.3-70b-versatile

is still available.

Always use a model that is actually available to the Groq account.

---

# 19. Model Authorization

Users should not be allowed to freely choose expensive or restricted models.

Example:

FREE:

openai/gpt-oss-20b

PRO:

openai/gpt-oss-20b
approved additional models

ENTERPRISE:

approved enterprise models

The backend checks:

Requested model
↓
User plan
↓
Allowed models
↓
Allowed?

If not:

403 Forbidden

The client cannot bypass this policy by changing the model field.

---

# 20. Model-Specific Limits

Different models can have different controls.

Example:

Small model:

maximum output tokens = 1,000

Large model:

maximum output tokens = 4,000

Expensive model:

special tenant budget required

The server must enforce these values.

---

# 21. Prompt Size Limits

Large prompts can cause unexpected token consumption.

The API should limit:

- Prompt size
- Input tokens
- File size
- Retrieved documents
- Output tokens
- Agent steps
- Tool calls

Example:

MAX_PROMPT_LENGTH=10000

If the prompt exceeds the configured limit:

HTTP 413 Payload Too Large

Example:

{
"success": false,
"error": "prompt_too_large"
}

For production, token-based validation is more accurate than character length alone.

---

# 22. Maximum Output Tokens

The server should control maximum generated tokens.

Example:

Maximum output tokens:

1,000

The client should not be allowed to request:

100,000

unless the server policy permits it.

Correct architecture:

Client request
↓
Requested max tokens
↓
Server policy
↓
Effective max tokens
↓
Groq

---

# 23. Concurrency

Rate limiting controls:

requests per time period

Concurrency controls:

requests running simultaneously

Example:

Maximum concurrent AI requests:

3

Current:

Job 1 → running
Job 2 → running
Job 3 → running

Job 4:

Rejected or queued

When Job 1 finishes:

Job 4 → allowed

---

# 24. Why Concurrency Matters

Some AI operations are expensive:

- Long generations
- Large RAG operations
- Agent workflows
- Document processing
- Embedding jobs
- Tool calls

Without concurrency control:

100 simultaneous requests
↓
100 LLM calls
↓
Resource exhaustion
↓
Potentially large costs

Therefore:

Rate Limit

- Concurrency Limit

is stronger than either alone.

---

# 25. Agent Cost Protection

Agents can call tools repeatedly.

Example:

User
↓
Agent
↓
Tool
↓
LLM
↓
Tool
↓
LLM
↓
Tool
↓
LLM

Without limits, an agent can continue indefinitely.

Always define:

maxIterations
maxToolCalls
maxTokens
timeout
budget

Example:

{
"maxIterations": 8,
"maxToolCalls": 10,
"maxTokens": 10000,
"timeoutMs": 30000
}

---

# 26. Budget Guard

A stronger architecture is:

Request
↓
Estimate budget
↓
Reserve budget
↓
Run AI
↓
Track actual usage
↓
Finalize usage
↓
Release unused reservation

For an agent:

Budget
↓
Step 1
↓
Step 2
↓
Step 3
↓
Budget exhausted
↓
STOP

This prevents runaway AI costs.

---

# 27. Cost Calculation

Cost calculation can be provider-independent.

Formula:

Input cost =
input tokens / 1,000,000
× input price per million

Output cost =
output tokens / 1,000,000
× output price per million

Total cost:

Input cost + Output cost

Example configuration:

Input price:

$1 per 1M tokens

Output price:

$3 per 1M tokens

Usage:

100,000 input tokens

20,000 output tokens

Input cost:

# 100,000 / 1,000,000 × 1

$0.10

Output cost:

# 20,000 / 1,000,000 × 3

$0.06

Total:

$0.16

The pricing values should be configurable and updated according to the provider/model pricing actually used.

---

# 28. Usage Service

The usage service is responsible for recording AI usage.

It should track:

- User
- Tenant
- Model
- Request ID
- Input tokens
- Output tokens
- Total tokens
- Timestamp

A production application would persist these records to a database or analytics system.

---

# 29. Cost Service

The cost service converts token usage into estimated cost.

Flow:

Groq response
↓
Token usage
↓
Cost calculation
↓
Usage record
↓
Budget / billing system

---

# 30. Monthly Quota

Example:

Free plan:

100,000 tokens/month

Current usage:

98,000

New request:

10,000

Calculation:

# 98,000 + 10,000

108,000

Limit:

100,000

Result:

Quota exceeded

The server should reject the request if the estimated or reserved usage would exceed the allowed quota.

---

# 31. Quota Storage

For learning:

An in-memory usage store can be used.

For production:

Use durable/shared storage.

Example:

Redis
↓
Fast counters

Database
↓
Durable usage records

This provides both fast enforcement and reliable reporting.

---

# 32. Rate Limit Headers

A useful API can return headers such as:

X-RateLimit-Limit

X-RateLimit-Remaining

X-RateLimit-Reset

Example:

X-RateLimit-Limit: 60
X-RateLimit-Remaining: 42

The exact header names and semantics should be consistent across the API.

---

# 33. Complete Request Flow

POST /api/chat
↓
Authentication
↓
Authorization
↓
Tenant Check
↓
IP/User Rate Limit
↓
Tenant Rate Limit
↓
Monthly Quota
↓
Model Authorization
↓
Prompt Validation
↓
Concurrency Check
↓
Agent Limits
↓
Groq
↓
Track Tokens
↓
Calculate Cost
↓
Store Usage
↓
Response

---

# 34. Security Principle

Day 69 answered:

WHO are you?

WHAT are you allowed to do?

Day 70 answers:

HOW MUCH are you allowed to consume?

Together:

Authentication
↓
Authorization
↓
Rate Limit
↓
Quota
↓
Cost Control

---

# 35. CI/CD Integration

Day 68 CI/CD should test the controls.

Pipeline:

Push
↓
Install dependencies
↓
Lint
↓
Unit Tests
↓
Authentication Tests
↓
Authorization Tests
↓
Tenant Isolation Tests
↓
Rate Limit Tests
↓
Quota Tests
↓
Cost Tests
↓
Concurrency Tests
↓
Security Tests
↓
Build
↓
Deploy

---

# 36. Required Tests

Rate limit:

1 request
→ 200

10 requests
→ allowed

11th request
→ 429

Quota:

Usage = 99,000

Request = 500

Limit = 100,000

Result:

Allowed

Usage = 100,000

Request = 1

Result:

Rejected

Concurrency:

Limit = 3

Job 1 → allowed
Job 2 → allowed
Job 3 → allowed
Job 4 → rejected/queued

Cost:

Input tokens

- Output tokens
  ↓
  Estimated cost

  ***

# 37. Production Architecture

Client
↓
Load Balancer
↓
API Server
↓
Authentication
↓
Authorization
↓
Redis Rate Limiter
↓
Quota Service
↓
Model Policy
↓
Concurrency Control
↓
Groq
↓
Usage Service
↓
Database

Redis:

- Rate limits
- Short-lived counters
- Concurrency state

Database:

- Usage
- Billing
- Durable records
- Audit records
- Tenant budgets

---

# 38. Multi-Tenant Architecture

User
↓
Tenant
↓
Plan
↓
Permissions
↓
Rate Limit
↓
Quota
↓
Budget
↓
RAG
↓
Groq

Tenant isolation must be enforced independently from rate limiting.

Rate limiting does not replace authorization.

---

# 39. Abuse Prevention

Potential abuse:

Repeated requests
↓
Rate limiter

Huge monthly consumption
↓
Quota

Large prompts
↓
Prompt validation

Expensive model selection
↓
Model policy

Too many simultaneous requests
↓
Concurrency limit

Agent loop
↓
Iteration/tool/time limits

Unexpected spending
↓
Budget guard

---

# 40. Important Production Rules

Never trust usage values from the client.

Never trust client-selected plans.

Never allow unrestricted model selection.

Never rely only on IP rate limiting for authenticated APIs.

Never allow unlimited agent iterations.

Never allow unlimited tool calls.

Never allow unlimited output tokens.

Never rely only on in-memory state in a multi-instance production deployment.

Always track actual server-side token usage.

Always enforce tenant isolation.

Always test 429 behavior.

---

# 41. Day 70 Summary

Rate limit:

Controls request speed.

Quota:

Controls total consumption.

Token tracking:

Measures actual AI usage.

Cost tracking:

Estimates financial consumption.

Concurrency:

Controls simultaneous AI work.

Model policy:

Controls which models can be used.

Prompt limits:

Controls input size.

Agent limits:

Controls autonomous execution.

Budget guard:

Controls maximum spending.

---

# 42. Core Production Rule

WHO?
↓
CAN DO WHAT?
↓
HOW MUCH?
↓
AT WHAT COST?
↓
FOR HOW LONG?
↓
LLM

---

# 43. Day 70 Completion

After Day 70, the GenAI backend contains:

Authentication

- Authorization
- Tenant Isolation
- Rate Limiting
- Quotas
- Concurrency Control
- Model Authorization
- Prompt Validation
- Token Tracking
- Cost Tracking
- Agent Protection

This forms the core security and cost-control layer of a production GenAI backend.

---

# 44. Next Step

The next production layer should focus on:

- Monitoring
- Logging
- Usage analytics
- Billing analytics
- Cost dashboards
- Tenant usage dashboards
- Alerts
- Budget alerts
- Error tracking
- Model performance monitoring
- AI observability

The goal is to answer:

Who is using the system?

How many tokens are they consuming?

Which model is being used?

How much does each tenant cost?

Which endpoint is expensive?

Which users are approaching their quota?

When did an unusual usage spike occur?

That is the foundation of production GenAI observability and billing analytics.
