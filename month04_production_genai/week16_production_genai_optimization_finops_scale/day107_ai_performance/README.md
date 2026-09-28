# Day 107 — AI Performance Optimization & Latency Engineering

A runnable Node.js implementation of the Day 107 exercises using Groq's `openai/gpt-oss-20b` model.

## 1. Requirements

- Node.js 20+
- Groq API key

## 2. Install

```bash
npm install
```

## 3. Configure environment

Copy `.env.example` to `.env` and set:

```env
GROQ_API_KEY=your_key_here
GROQ_MODEL=openai/gpt-oss-20b
GROQ_REASONING_EFFORT=low
LLM_TIMEOUT_MS=15000
CONCURRENCY_LIMIT=5
PORT=3000
```

## 4. Run tests

```bash
npm test
```

## 5. Run parallel demo

```bash
npm run parallel-demo
```

## 6. Start API

```bash
npm start
```

Then:

- `GET /health`
- `GET /api/performance/demo`
- `GET /api/performance/demo?slowLlmMs=3000`
- `POST /api/chat` with `{ "query": "What is latency?" }`
- `GET /api/chat/stream?q=Explain%20TTFT%20in%20simple%20terms`

## 7. Run real Groq benchmark

```bash
npm run benchmark
```

The measured report is written to `reports/day107-performance-report.json`.

## 8. Day 107 learning map

| Concept | File |
|---|---|
| Timer | `src/performance/timer.js` |
| Budget | `src/performance/performance-budget.js` |
| Performance events | `src/performance/performance-event.js` |
| Concurrency | `src/performance/concurrency.js` |
| Timeout | `src/performance/timeout.js` |
| Groq LLM | `src/llm/groq-client.js` |
| Streaming | `src/streaming/stream-handler.js` |
| Pipeline | `src/pipeline.js` |
| HTTP API | `src/server.js` |
| Benchmark dataset | `evaluation/performance/test-cases.json` |
| Benchmark config | `evaluation/performance/benchmark-config.json` |
| Benchmark runner | `scripts/benchmark.js` |
| Tests | `tests/performance/` |
