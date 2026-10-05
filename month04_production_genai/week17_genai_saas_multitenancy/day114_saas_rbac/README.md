# Day 114 — GenAI SaaS Authentication, Authorization & RBAC

A modern Node.js + Express 5 + Groq SDK implementation of Day 114.

## Requirements

- Node.js 20 LTS or later
- A Groq API key for `/ai/generate`

## Setup

```bash
npm install
copy .env.example .env
```

Set `GROQ_API_KEY` in `.env`.

The default model is:

```text
openai/gpt-oss-20b
```

## Run

```bash
npm run dev
```

## Test

```bash
npm test
```

## Demo API keys

These are fake learning-project keys:

- `sk-owner`
- `sk-admin`
- `sk-member`
- `sk-viewer`
- `sk-beta-member`
- `sk-beta-viewer`
- `sk-inactive`

Do not use these as production credentials.

## Example

```bash
curl -X POST http://localhost:3000/ai/generate ^
  -H "Authorization: Bearer sk-member" ^
  -H "Content-Type: application/json" ^
  -d "{\"prompt\":\"Explain RAG in simple terms\"}"
```

On PowerShell, use `curl.exe` if needed.
