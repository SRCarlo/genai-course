# Day 112 — Production GenAI Optimization Capstone

Production GenAI platform using **Groq API** and **openai/gpt-oss-20b**.

## Requirements

- Node.js 20+
- Groq API key

## Setup

```powershell
npm install
copy .env.example .env
```

Put your key in `.env`:

```env
GROQ_API_KEY=your_key_here
GROQ_MODEL=openai/gpt-oss-20b
```

## Run

```powershell
npm test
npm run dev
```

## Endpoints

- `GET /health`
- `POST /generate`
- `GET /models`
- `GET /metrics`
- `GET /cost`
- `GET /circuits`

## Architecture

Request → Validation → Rate Limit → Cache → Model Router → Groq Provider → Retry/Circuit Breaker → Fallback → Cost → Evaluation → Metrics → Response.

The project intentionally uses the Groq OpenAI-compatible HTTP endpoint directly through Node's native `fetch`, so it does not depend on an OpenAI SDK or a provider SDK whose APIs may change.
