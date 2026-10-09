# Day 118 — Billing Integration & Webhook Reliability

A learning project based on the Day 118 assignment. It includes a mock payment provider, checkout idempotency, local HMAC webhook verification, duplicate event handling, tests, and an optional Groq AI billing-help endpoint.

## Requirements
- Node.js **22.12 or newer** (required by the current Vitest major line).
- npm.
- A Groq API key only if you want to use the optional AI endpoint.

## Setup (Windows PowerShell)
```powershell
# Navigate to the Week 17 folder first, then:
mkdir day118_billing_integration
cd day118_billing_integration
# Extract this project's files into this folder if you downloaded the ZIP.

Copy-Item .env.example .env
npm install
```

Open `.env` and set `BILLING_WEBHOOK_SECRET` to a long random local secret. To enable Groq, set `GROQ_API_KEY` from your Groq Console. Do not commit `.env`.

## Run
```powershell
npm test
npm run dev
```

Health check:
```powershell
Invoke-RestMethod http://localhost:3000/health
```

Checkout demo:
```powershell
$body = @{ planId = "pro"; idempotencyKey = "checkout-demo-001" } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/billing/checkout -ContentType "application/json" -Body $body
```

Optional Groq billing help (only mounted when `GROQ_API_KEY` is set):
```powershell
$body = @{ question = "Explain why webhook idempotency matters." } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/ai/billing-help -ContentType "application/json" -Body $body
```

Model: `openai/gpt-oss-20b`. The Groq key is only used server-side.

## Important limitations
- The payment provider is a mock and no real payment is processed.
- The event store and checkout idempotency are in memory and reset on restart.
- The demo HMAC header (`x-demo-signature`) is not a real provider protocol.
- Tenant identity is hard-coded for learning. Use authenticated identity in a real application.
- The AI endpoint does not grant access, confirm payments, or modify billing state.
- Production needs a database, unique constraints, durable retry workers, provider-specific verification, monitoring, reconciliation, and entitlement enforcement.

## Project tree
```text
src/
  app.js
  config/config.js
  ai/groq.service.js
  billing/
    checkout.service.js
    event-store.js
    payment-provider.js
    webhook.service.js
  webhooks/
    signature.js
    webhook.routes.js
tests/
  checkout.test.js
  signature.test.js
  webhook.test.js
notes/day118_notes.md
assignment/day118_assignment.md
.env.example
.gitignore
package.json
README.md
```
