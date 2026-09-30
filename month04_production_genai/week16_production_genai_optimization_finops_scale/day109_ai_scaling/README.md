# Day 109 — AI Scaling, Load Testing & Capacity Planning

This project follows the Day 109 learning plan.

## LLM modes

### 1. Mock mode — recommended for load tests
.env:
LLM_PROVIDER=mock

This avoids spending API credits during artificial load.

### 2. Groq mode — real LLM
.env:
LLM_PROVIDER=groq
GROQ_API_KEY=your_key
GROQ_MODEL=openai/gpt-oss-20b

The application uses the Groq SDK and GPT-OSS 20B.

## Setup

```bash
npm install
copy .env.example .env
```

Edit `.env`.

## Start

```bash
npm run dev
```

Health:
```bash
curl http://localhost:3000/health
```

Metrics:
```bash
curl http://localhost:3000/metrics
```

Generate:
```bash
curl -X POST http://localhost:3000/generate ^
  -H "Content-Type: application/json" ^
  -d "{\"message\":\"Explain load testing in simple words.\"}"
```

## Load tests

```bash
npm run baseline
npm run stress
npm run spike
npm run endurance
```

## Tests

```bash
npm test
```

## Important
Do not use the real Groq provider for aggressive artificial load tests unless you understand the provider limits and cost. Use `LLM_PROVIDER=mock` for the Day 109 benchmark and switch to Groq for a small functional verification.

## Model
openai/gpt-oss-20b
