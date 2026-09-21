# Day 100 — Production RAG Evaluation & Observability

This project implements the Day 100 architecture from the course:

User → API → Request ID → Retrieval → Context → Groq LLM → Answer
                                      ↘ Evaluation → Metrics → Observability

## Important API choice

This project uses **Groq**, not the OpenAI API.

- SDK: `groq-sdk`
- Model: `openai/gpt-oss-20b`
- Environment variable: `GROQ_API_KEY`

No `openai` npm package is required.

## 1. Install

```powershell
npm install
```

Copy `.env.example` to `.env` and add your Groq API key.

```powershell
Copy-Item .env.example .env
```

Then edit `.env`.

## 2. Start API

```powershell
npm start
```

Test:

```powershell
Invoke-RestMethod `
  -Uri http://localhost:3000/health `
  -Method Get
```

Chat:

```powershell
$body = @{
  question = "How do I reset my password?"
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri http://localhost:3000/api/chat `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

## 3. Run tests

```powershell
npm test
```

## 4. Run evaluation

```powershell
npm run evaluate
```

The evaluator runs the golden dataset through retrieval + Groq generation and writes:

```text
evaluation/report.json
```

## 5. Run quality gate

```powershell
npm run quality
```

Exit code is non-zero when the configured thresholds fail.

## Project structure

```text
day100_rag_evaluation/
├── src/
│   ├── api/
│   │   ├── routes/chat.routes.js
│   │   ├── controllers/chat.controller.js
│   │   └── middleware/errorHandler.js
│   ├── application/chat.service.js
│   ├── ai/
│   │   ├── retrieval/
│   │   │   ├── documents.js
│   │   │   ├── tokenizer.js
│   │   │   ├── vector-search.js
│   │   │   ├── keyword-search.js
│   │   │   └── hybrid-search.js
│   │   ├── rag/rag.service.js
│   │   └── llm/groq.client.js
│   ├── infrastructure/observability/
│   │   ├── request-id.js
│   │   ├── tracer.js
│   │   ├── cost.js
│   │   └── failure.types.js
│   ├── app.js
│   └── server.js
├── evaluation/
│   ├── dataset.json
│   ├── retrieval.metrics.js
│   ├── answer.metrics.js
│   ├── thresholds.js
│   ├── quality-gate.js
│   ├── evaluator.js
│   └── report.js
├── tests/
│   ├── evaluation.test.js
│   ├── quality-gate.test.js
│   └── observability.test.js
├── notes/day100_notes.md
└── assignment/day100_assignment.md
```

## Evaluation model

The project deliberately starts with deterministic metrics:

- Recall@K
- Precision@K
- MRR
- keyword/topic coverage
- latency
- token usage
- cost
- failure categories

The LLM is used for answer generation. A separate optional LLM judge is also available through the same Groq model.

## Production principle

Build → Evaluate → Observe → Analyze → Improve → Evaluate again.
