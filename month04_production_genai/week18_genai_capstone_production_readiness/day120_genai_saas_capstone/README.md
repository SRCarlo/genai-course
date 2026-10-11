# Day 120 — Multi-Tenant GenAI Knowledge Assistant

A learning capstone for a multi-tenant GenAI SaaS platform. It uses Node.js, Express, modular services, tenant-scoped keyword retrieval, usage accounting, entitlement checks, and Groq's `openai/gpt-oss-20b` model.

> **Important:** This is a learning project, not a production-ready SaaS. Authentication, retrieval, subscriptions, and usage persistence are demonstration implementations. See [production readiness](docs/production-readiness.md).

## Stack

- Node.js 22+
- Express 5
- Groq API via `groq-sdk`
- Model: `openai/gpt-oss-20b`
- Zod validation, Helmet, express-rate-limit
- Pino structured logging
- Vitest and Supertest

## 1. Prerequisites

- Node.js 22 or later and npm.
- A Groq API key from [Groq Console](https://console.groq.com/).
- PowerShell on Windows, or a terminal on macOS/Linux.

## 2. Install

```powershell
npm install
Copy-Item .env.example .env
```

Open `.env` and set `GROQ_API_KEY` to your own key. Never commit `.env` or expose the key in frontend code.

## 3. Run tests

```powershell
npm test
npm run check
npm run lint
```

The tests use a fake LLM adapter, so they do not consume Groq credits.

## 4. Start the API

```powershell
npm run dev
```

Health check:

```powershell
Invoke-RestMethod http://localhost:3000/health
```

Expected shape:

```json
{
  "status": "ok",
  "model": "openai/gpt-oss-20b"
}
```

## 5. Send a chat request

The sample development-only identity headers work only when `NODE_ENV` is not `production`. Do not use this identity mechanism in a deployed application.

```powershell
$headers = @{
  "x-demo-tenant-id" = "tenant_demo"
  "x-demo-user-id" = "user_demo"
}
$body = @{
  question = "What does the platform provide?"
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri "http://localhost:3000/api/chat" `
  -Headers $headers `
  -ContentType "application/json" `
  -Body $body
```

The request uses the real Groq API. A valid `GROQ_API_KEY` and network access are required. The demo retrieval returns results only when words from the question match the sample document.

## 6. API endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/health` | API health and configured model |
| POST | `/api/chat` | Ask a question grounded in tenant documents |

`POST /api/chat` body:

```json
{ "question": "What does the platform provide?" }
```

Successful responses include `answer`, `sources`, `usage`, `model`, and `requestId`. Errors return a controlled `error` code and, where available, `requestId`.

## 7. Environment variables

| Variable | Purpose | Default |
| --- | --- | --- |
| `NODE_ENV` | Runtime environment | `development` |
| `PORT` | HTTP port | `3000` |
| `LOG_LEVEL` | Pino log level | `info` |
| `GROQ_API_KEY` | Server-side Groq API key | empty |
| `GROQ_MODEL` | Groq model ID | `openai/gpt-oss-20b` |
| `GROQ_TIMEOUT_MS` | Provider request timeout | `30000` |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:3000` |
| `CHAT_RATE_LIMIT_WINDOW_MS` | Rate-limit window | `60000` |
| `CHAT_RATE_LIMIT_MAX` | Requests per IP per window | `20` |
| `MAX_QUESTION_LENGTH` | Maximum question characters | `4000` |
| `MAX_CONTEXT_CHARACTERS` | Maximum source context characters | `16000` |

## 8. Architecture

See [docs/architecture.md](docs/architecture.md) for module boundaries and the request lifecycle.

## 9. Known limitations

- Demo identity headers are not real authentication.
- Sample documents and subscription data are hard-coded.
- Keyword retrieval is not semantic RAG and does not use embeddings.
- Usage is stored in memory and resets on restart.
- No document upload, durable database, billing provider, token quota reservation, or webhook processing is implemented.
- Structural answer checks do not prove factual correctness.

## 10. Next improvements

1. Add verified authentication and membership storage.
2. Use PostgreSQL + pgvector and tenant-scoped database queries.
3. Add ingestion, parsing, chunking, embeddings, and retrieval evaluation.
4. Add durable usage ledger and atomic quotas.
5. Add verified billing webhooks, metrics, traces, and deployment hardening.

## Groq model reference

The configured model ID is `openai/gpt-oss-20b`. Check Groq's current [supported models](https://console.groq.com/docs/models) and [API overview](https://console.groq.com/docs/overview) before deployment because provider availability and limits can change.
