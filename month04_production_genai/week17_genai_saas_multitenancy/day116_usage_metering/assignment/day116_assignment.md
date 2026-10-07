# Day 116 Assignment

## Part 1 — Plans

Implemented:

- free
- starter
- pro

Each plan contains:

- requests per minute
- monthly requests
- monthly tokens

## Part 2 — Usage Meter

Every successful AI request records:

- requestId
- tenantId
- userId
- apiKeyId
- operation
- model
- inputTokens
- outputTokens
- totalTokens
- latencyMs
- cost
- timestamp

## Part 3 — Usage Aggregation

Implemented:

- getTenantUsage()
- getUserUsage()
- getApiKeyUsage()
- getModelUsage()
- user/model/key aggregation by tenant

## Part 4 — Rate Limiting

Implemented:

- fixed-window rate limiter
- sliding-window rate limiter
- tenant-level limit
- API-key-level limit
- rate-limit headers
- Retry-After
- HTTP 429

## Part 5 — Quotas

Implemented:

- monthly request quota
- monthly token quota
- projected token check before AI execution

## Part 6 — Cost

Implemented model-specific pricing abstraction for:

`openai/gpt-oss-20b`

## Part 7 — AI Integration

Implemented real Groq API integration using `groq-sdk`.

## Part 8 — Usage APIs

Implemented:

- GET /v1/usage
- GET /v1/usage/models
- GET /v1/usage/api-keys
- GET /v1/usage/users
- GET /v1/usage/me
- POST /v1/chat

## Request pipeline

API key
→ authentication
→ tenant
→ API-key rate limit
→ tenant rate limit
→ projected quota check
→ Groq
→ actual usage
→ cost
→ usage event
→ response
