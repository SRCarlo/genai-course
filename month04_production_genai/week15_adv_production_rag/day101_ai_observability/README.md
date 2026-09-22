# Day 101 — AI Observability

Production AI Monitoring, LLM Observability and Alerting.

## Stack
- Node.js
- Express
- Groq API
- Groq SDK
- openai/gpt-oss-20b
- Node.js Test Runner

## Setup
1. Copy `.env.example` to `.env`
2. Add your `GROQ_API_KEY`
3. Run `npm install`
4. Run `npm test`
5. Run `npm start`

## Endpoints
GET `/health`
GET `/metrics`
POST `/api/chat`

POST body:
```json
{"question":"What are the three pillars of observability?"}
```

## Scripts
- `npm start`
- `npm run dev`
- `npm test`
- `npm run evaluate:monitoring`

This project uses Groq directly; there is no OpenAI API client dependency.