# Day 99 — Hybrid RAG

## Install

```bash
npm install
```

## Configure `.env`

```env
GROQ_API_KEY=your_key
GROQ_MODEL=openai/gpt-oss-20b
```

## Run

```bash
npm run dev
```

POST `/api/chat`:

```json
{ "question": "Why am I getting HTTP 401?" }
```

## Tests

```bash
npm test
```

## Evaluation

```bash
npm run eval
```

Embeddings are intentionally deterministic/local for the Day 99 mock-data assignment. The LLM layer uses Groq GPT-OSS 20B.
