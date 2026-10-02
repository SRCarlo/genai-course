# Day 111 — Multi-Model & Multi-Provider AI Architecture

Production-oriented AI Gateway example using Groq.

## Stack

- Node.js
- Express
- Groq SDK
- `openai/gpt-oss-20b`
- Node built-in test runner

## 1. Install

```bash
npm install
```

## 2. Configure Groq

Copy:

```bash
copy .env.example .env
```

Then set:

```env
GROQ_API_KEY=your_key
GROQ_MODEL=openai/gpt-oss-20b
```

## 3. Run tests

```bash
npm test
```

## 4. Start server

```bash
npm run dev
```

## 5. Test

### Health

```bash
curl http://localhost:3000/health
```

### Models

```bash
curl http://localhost:3000/models
```

### Real Groq request

PowerShell:

```powershell
Invoke-RestMethod `
  -Method POST `
  -Uri http://localhost:3000/generate `
  -ContentType "application/json" `
  -Body '{"task":"reasoning","complexity":"high","prompt":"Explain multi-provider AI architecture in simple terms.","maxCostTier":"high","requiresReasoning":true}'
```

### Chat request

```powershell
Invoke-RestMethod `
  -Method POST `
  -Uri http://localhost:3000/generate `
  -ContentType "application/json" `
  -Body '{"task":"chat","complexity":"medium","prompt":"Explain model routing in 5 bullet points."}'
```

## Provider health simulation

Mark provider-a unhealthy:

```powershell
Invoke-RestMethod `
  -Method POST `
  -Uri http://localhost:3000/providers/provider-a/health `
  -ContentType "application/json" `
  -Body '{"healthy":false}'
```

Then call `/generate`. The gateway will skip the unhealthy primary and try the fallback chain.

Restore provider-a:

```powershell
Invoke-RestMethod `
  -Method POST `
  -Uri http://localhost:3000/providers/provider-a/health `
  -ContentType "application/json" `
  -Body '{"healthy":true}'
```

## Architecture

User
-> AI Gateway
-> Model Router
-> Model Registry
-> Provider Router
-> Provider Adapter
-> Groq
-> Response

Provider B/C are fallback simulation adapters. Replace them with real providers when implementing true multi-provider production routing.
