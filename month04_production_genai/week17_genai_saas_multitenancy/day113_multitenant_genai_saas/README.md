# Day 113 — Multi-Tenant GenAI SaaS Platform

A learning project demonstrating tenant-aware authentication, authorization, rate limiting,
token budgets, Groq AI generation, usage metering, cost tracking, tenant-aware RAG,
tenant-aware cache, and isolation tests.

## Runtime

Use Node.js 24 LTS or newer.

## Setup

```powershell
cd D:\Naoe\Study\GenAI\genai-course\day113_multitenant_genai_saas
npm install
Copy-Item .env.example .env
```

Put your Groq API key in your local `.env` file. Never commit that file.

## Run

```powershell
npm run dev
```

Health:

```text
GET http://localhost:3000/health
```

AI endpoint:

```text
POST http://localhost:3000/api/v1/ai/generate
Authorization: Bearer sk-acme-demo
Content-Type: application/json

{
  "prompt": "Explain multi-tenancy in simple words.",
  "model": "fast"
}
```

The API key determines the tenant. Do not send tenantId from the client.

## Demo API keys

- `sk-acme-demo` -> tenant-acme / user-001
- `sk-beta-demo` -> tenant-beta / user-002
- `sk-enterprise-demo` -> tenant-enterprise / user-003

These are demo-only keys stored in memory. Production systems should hash API keys and store
only hashes, with rotation/revocation/auditing.

## Tests

```powershell
npm test
```

Tests cover authentication, tenant resolution, plans, model permissions, rate limits,
budgets, RAG isolation, and cache isolation.

## Important

This is an educational in-memory implementation. A production platform should replace
the in-memory registries with a database, use a distributed rate limiter such as Redis,
hash API keys, use a durable usage ledger, and enforce tenant filters at the database/vector
database layer.

## Secrets and GitHub safety

This project does not store real API keys in source code.

1. Copy `.env.example` to `.env`.
2. Add your own `GROQ_API_KEY`.
3. Add three different tenant API keys for `ACME_API_KEY`, `BETA_API_KEY`, and `ENTERPRISE_API_KEY`.
4. Keep `.env` local. It is ignored by Git.
5. Run `npm run secret-scan` before pushing.
6. Run `npm run check` before committing.

### Generate tenant API keys locally

Run this in the project directory to generate one random value at a time:

```bash
node --input-type=module -e "import crypto from 'node:crypto'; console.log(crypto.randomBytes(32).toString('hex'))"
```

Run it three times and paste the three generated values into your local `.env` as the tenant API-key values. Never paste those values into JavaScript, Markdown, Thunder Client collections that will be committed, or GitHub.
