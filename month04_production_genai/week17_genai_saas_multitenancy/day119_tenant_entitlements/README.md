# Day 119 — Tenant Entitlements & Subscription Lifecycle

A Node.js + Express learning project for plan entitlements, tenant membership, subscription status, quota reservations, and Groq AI chat.

## Requirements
- Node.js 20 or newer
- npm
- A Groq API key for real AI responses (tests do not need a key)

## Setup (PowerShell)
```powershell
cd path\to\day119_tenant_entitlements
npm install
Copy-Item .env.example .env
```

Open `.env` and set:
```dotenv
GROQ_API_KEY=your_real_groq_api_key
GROQ_MODEL=openai/gpt-oss-20b
PORT=3000
NODE_ENV=development
```

Never commit `.env` or put the API key in frontend code.

## Run tests
```powershell
npm test
```

## Start development server
```powershell
npm run dev
```

Health endpoint:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/health"
```

The `/health` endpoint is public and does not require demo headers.

## Local demo authentication
This project deliberately uses demo headers for learning only. The seeded memberships are:
- `user_001` → `tenant_acme`
- `user_002` → `tenant_beta`

These headers are spoofable and must not be used in production.

## Seed a subscription for local testing

To enable a Pro subscription fixture for the demo tenant, add this line to `.env`:

```dotenv
SEED_DEMO_DATA=true
```

This seed runs only when `NODE_ENV=development`. Keep it disabled in production. Restart the server after changing `.env`.

## Test entitlements with PowerShell
After adding the development-only seed:
```powershell
$headers = @{
  "x-demo-user-id" = "user_001"
  "x-demo-tenant-id" = "tenant_acme"
}
Invoke-RestMethod -Uri "http://localhost:3000/api/entitlements" -Headers $headers
```

## Test chat
```powershell
$headers = @{
  "x-demo-user-id" = "user_001"
  "x-demo-tenant-id" = "tenant_acme"
}
$body = @{ question = "Explain tenant isolation in one paragraph." } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/chat" -Headers $headers -ContentType "application/json" -Body $body
```

## Important limitations
This is a teaching prototype, not production-ready SaaS:
- subscriptions, memberships, and usage are in-memory;
- demo identity headers can be spoofed;
- quota reservation is only process-local;
- a production system needs verified authentication, durable storage, billing-webhook verification, atomic quota reservations, resource-level authorization, tenant-scoped RAG, monitoring, and integration tests.
