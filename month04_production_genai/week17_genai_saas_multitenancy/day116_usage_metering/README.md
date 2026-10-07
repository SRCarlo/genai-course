# Day 116 — GenAI SaaS Usage Metering, Quotas & Rate Limiting

This project implements the Day 116 architecture as a self-contained Node.js API.

## Pipeline

API Key → Tenant → Rate Limit → Quota → Groq → Actual Usage → Cost → Usage Event

## Tech

- Node.js ESM
- Express
- dotenv
- groq-sdk
- Groq model: `openai/gpt-oss-20b`
- Node built-in test runner

## 1. Install

```powershell
npm install
```

## 2. Configure

Copy `.env.example` to `.env` and put your Groq API key in:

```env
GROQ_API_KEY=your_key
```

The application uses:

```env
GROQ_MODEL=openai/gpt-oss-20b
```

## 3. Run

```powershell
npm run dev
```

or:

```powershell
npm start
```

Server:

```text
http://localhost:3000
```

## 4. Demo API key

The demo API key is:

```text
day116-demo-key
```

Send it as:

```text
x-api-key: day116-demo-key
```

## 5. Chat

```powershell
curl.exe -X POST http://localhost:3000/v1/chat `
  -H "Content-Type: application/json" `
  -H "x-api-key: day116-demo-key" `
  -d "{\"prompt\":\"Explain rate limiting in simple words.\"}"
```

## 6. Usage

```powershell
curl.exe http://localhost:3000/v1/usage -H "x-api-key: day116-demo-key"
```

Models:

```powershell
curl.exe http://localhost:3000/v1/usage/models -H "x-api-key: day116-demo-key"
```

API keys:

```powershell
curl.exe http://localhost:3000/v1/usage/api-keys -H "x-api-key: day116-demo-key"
```

Users:

```powershell
curl.exe http://localhost:3000/v1/usage/users -H "x-api-key: day116-demo-key"
```

## 7. Health

```powershell
curl.exe http://localhost:3000/health
```

## 8. Tests

```powershell
npm test
```

## Important

The usage store and rate limiter are intentionally in-memory for Day 116 learning. The API is structured so they can later be replaced by PostgreSQL/Redis without changing the business concepts.
