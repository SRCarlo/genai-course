# Day 108 — LLM Caching & Intelligent Request Optimization

Production GenAI optimization project focused on reducing unnecessary LLM calls through caching and request deduplication.

## Tech Stack

- Node.js
- JavaScript ES Modules
- Groq API
- `openai/gpt-oss-20b`
- In-memory cache
- Node.js built-in test runner

## Setup

```bash
npm install
```

Create `.env`:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-20b
PORT=3000
```

## Run Demo

```bash
npm start
```

## Run Tests

```bash
npm test
```

## Run Mock Benchmark

```bash
npm run benchmark:mock
```

## API

### Health Check

```http
GET /
```

### Chat

```http
POST /api/chat
```

Example:

```json
{
  "query": "What is LLM caching?",
  "tenantId": "company-a",
  "userId": "user-101",
  "temperature": 0.2,
  "language": "en"
}
```

### Metrics

```http
GET /api/cache/metrics
```

### Clear Cache

```http
DELETE /api/cache
```

## Caching Flow

```text
Client
  |
  v
POST /api/chat
  |
  v
Generate deterministic cache key
  |
  v
Check cache
  |
  +---- HIT ----> Return cached response
  |
  +---- MISS
          |
          v
   Request Deduplicator
          |
          v
       Groq LLM
          |
          v
      Save to cache
          |
          v
   Return response
```

## Benchmark Summary

| Strategy           | LLM Calls | Cache Hits | Hit Rate | Estimated Cost |
| ------------------ | --------: | ---------: | -------: | -------------: |
| No Cache           |      1000 |          0 |       0% |            $10 |
| Exact Cache        |       100 |        900 |      90% |             $1 |
| Deduplicated Cache |       100 |        0\* |     0%\* |             $1 |

The benchmark uses simulated LLM latency and estimated cost, so these numbers are not actual Groq billing or production latency measurements.

## Key Concepts

- Exact-match caching
- Semantic caching
- TTL
- Cache invalidation
- Cache keys
- Request deduplication
- In-flight Promise sharing
- Cache metrics
- Cost optimization
- Tenant isolation
- Prompt/model versioning

## Project Structure

```text
day108_llm_caching/
├── src/
│   ├── cache/
│   ├── llm/
│   └── metrics/
├── evaluation/
├── reports/
├── tests/
├── notes/
├── assignment/
├── package.json
├── .env
├── .env.example
└── README.md
```

## Status

Day 108 completed.
