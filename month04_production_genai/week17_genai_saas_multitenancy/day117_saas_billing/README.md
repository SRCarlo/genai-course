# Day 117 — GenAI SaaS Billing

A clean, dependency-light implementation of the Day 117 billing architecture:

Tenant → Customer → Subscription → Plan → Entitlements → Usage → Pricing → Invoice → Payment → Webhook → Reconciliation

## Runtime

Use an Active/Maintenance LTS Node.js release. The project uses native ESM and the built-in `node:test` runner, so no test framework dependency is required.

## Install

```bash
npm install
```

Copy `.env.example` to `.env` and set `WEBHOOK_SECRET`.

Optional Groq configuration:

```env
GROQ_API_KEY=your_key
GROQ_MODEL=openai/gpt-oss-20b
```

The Day 117 billing flow itself does not require an LLM call.

## Run

```bash
npm run dev
```

Server: http://localhost:3000

## Test

```bash
npm test
```

## Demo

Create a Pro subscription and record 8M input + 5M output tokens:

```bash
curl -X POST http://localhost:3000/v1/demo/billing \
  -H "Content-Type: application/json" \
  -d '{"tenantId":"tenant_acme","email":"billing@acme.test","name":"ACME","planId":"pro","inputTokens":8000000,"outputTokens":5000000}'
```

Expected billing concept:

- Pro plan = $49.00
- Total usage = 13M tokens
- Included = 10M tokens
- Overage = 3M tokens
- Overage = $12.00
- Invoice subtotal = $61.00

## Important

This is an in-memory learning implementation. A production system should use durable shared storage/database, a real payment provider, durable webhook event storage, and reconciliation jobs.
