# Day 85 — RAG Evaluation, Observability & Production Quality

Production-style RAG system implementing:

- Hybrid retrieval
- Reranking
- RAG evaluation
- Recall@K
- Precision@K
- MRR
- Context relevance
- Faithfulness
- Answer correctness
- Request IDs
- Structured logging
- Request tracing
- Latency measurement
- P50/P95/P99
- Token tracking
- Cost tracking
- Failure classification
- Evaluation API
- Regression tests
- Groq GPT-OSS 20B

## LLM

This project uses:

openai/gpt-oss-20b

through Groq.

## Requirements

Node.js 20+

## Installation

```bash
npm install
```

# Day 85 — RAG Evaluation, Observability & Production Quality Engineering

A production-oriented RAG system that extends the Day 84 Advanced RAG project with:

- Retrieval evaluation
- Recall@K
- Precision@K
- MRR
- Context relevance
- Answer faithfulness
- Golden evaluation dataset
- Regression testing
- Request tracing
- Structured logging
- Latency monitoring
- Token tracking
- Cost tracking
- Failure classification
- Out-of-domain detection
- Evaluation APIs
- Production-oriented monitoring

The LLM provider used in this project is **Groq**, with:

```text
openai/gpt-oss-20b
```

No OpenAI API is required.

---

# 1. Project Goal

The goal of Day 85 is to move from:

```text
"I built a RAG system."
```

to:

```text
"I can measure, debug, evaluate and monitor my RAG system."
```

A production RAG application should answer questions such as:

```text
Did retrieval find the correct document?

Was the correct document ranked highly?

How relevant was the retrieved context?

Did the LLM generate a grounded answer?

Did the answer contain hallucinations?

How long did retrieval take?

How long did generation take?

How many tokens were consumed?

What did the request cost?

Which component failed?

Did a code change make retrieval worse?
```

This project provides the infrastructure needed to answer those questions.

---

# 2. Day 85 Architecture

The complete system looks like:

```text
                         ┌──────────────────────┐
                         │   Observability      │
                         │                      │
                         │ Logs                 │
                         │ Request ID           │
                         │ Timing               │
                         │ Tokens               │
                         │ Cost                 │
                         │ Errors               │
                         └──────────┬───────────┘
                                    │
                                    ▼

User
 │
 ▼
POST /api/rag/query
 │
 ▼
Query Processing
 │
 ▼
Query Rewrite
 │
 ▼
Hybrid Retrieval
 ├───────────────┐
 ▼               ▼
Vector Search   Keyword Search
 └───────────────┘
 │
 ▼
Hybrid Ranking
 │
 ▼
Reranking
 │
 ▼
Context Builder
 │
 ▼
Groq API
 │
 │ model:
 │ openai/gpt-oss-20b
 ▼
Generated Answer
 │
 ├── Sources
 ├── Trace
 ├── Token Usage
 └── Latency
```

Evaluation runs separately:

```text
Golden Dataset
      │
      ▼
Evaluation Runner
      │
      ▼
RAG System
      │
      ▼
Retrieved Documents
      │
      ├── Recall@3
      ├── Recall@5
      ├── Recall@10
      ├── Precision@3
      ├── Precision@5
      └── MRR
```

Generation quality can additionally be evaluated using:

```text
Context Relevance
Faithfulness
Answer Correctness
```

---

# 3. Learning Objectives

After completing Day 85, you should understand:

## Retrieval Evaluation

- Recall@K
- Precision@K
- MRR
- Retrieval failure
- Ranking quality
- Golden datasets

## Generation Evaluation

- Context relevance
- Faithfulness
- Answer correctness
- Grounded generation
- Hallucination detection

## Observability

- Request IDs
- Structured logs
- Request traces
- Component-level latency
- Token usage
- Cost calculation
- Failure classification

## Production Quality

- Regression testing
- P50 latency
- P95 latency
- P99 latency
- Out-of-domain detection
- Production monitoring
- Evaluation APIs

---

# 4. Project Structure

```text
day85_rag_observability/
│
├── src/
│   │
│   ├── ingestion/
│   │   └── ...
│   │
│   ├── retrieval/
│   │   └── ...
│   │
│   ├── reranking/
│   │   └── ...
│   │
│   ├── query/
│   │   └── ...
│   │
│   ├── context/
│   │   └── ...
│   │
│   ├── evaluation/
│   │   ├── retrieval.evaluator.js
│   │   ├── answer.evaluator.js
│   │   ├── evaluation.runner.js
│   │   ├── failure.classifier.js
│   │   └── metrics.js
│   │
│   ├── observability/
│   │   ├── logger.js
│   │   ├── timer.js
│   │   ├── trace.js
│   │   ├── request.context.js
│   │   └── cost.tracker.js
│   │
│   ├── llm/
│   │   └── ...
│   │
│   ├── routes/
│   │   ├── rag.routes.js
│   │   └── evaluation.routes.js
│   │
│   └── app.js
│
├── tests/
│   ├── evaluation.dataset.json
│   ├── retrieval.test.js
│   ├── metrics.test.js
│   └── rag.evaluation.test.js
│
├── notes/
│   └── day85_notes.md
│
├── assignment/
│   └── day85_assignment.md
│
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

# 5. Technology Stack

```text
Node.js
Express
JavaScript
Vitest
Groq API
OpenAI-compatible Groq SDK
RAG
Hybrid Retrieval
Reranking
Structured Logging
Evaluation
Observability
```

LLM:

```text
Provider: Groq
Model: openai/gpt-oss-20b
```

---

# 6. Groq Configuration

This project uses Groq instead of OpenAI.

Create:

```text
.env
```

Example:

```env
PORT=3000

GROQ_API_KEY=your_groq_api_key_here

GROQ_MODEL=openai/gpt-oss-20b
```

Never commit `.env`.

The `.gitignore` should contain:

```gitignore
node_modules/
.env
.env.local
*.log
coverage/
dist/
```

---

# 7. Getting a Groq API Key

Create a Groq account and generate an API key from the Groq developer console.

Store the key only in your environment:

```env
GROQ_API_KEY=your_key
```

Do not place the API key directly inside source code.

---

# 8. Installation

Clone or create the project:

```bash
cd day85_rag_observability
```

Install dependencies:

```bash
npm install
```

If the project uses a native dependency installation problem on Windows, remove the generated dependency directories and reinstall:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```

Then run tests:

```bash
npm test
```

---

# 9. Development Server

Start the server:

```bash
npm run dev
```

Or:

```bash
npm start
```

Expected output:

```text
RAG API running on port 3000
```

---

# 10. Health Check

Endpoint:

```text
GET /health
```

Example:

```bash
curl http://localhost:3000/health
```

Response:

```json
{
  "status": "ok",
  "service": "rag-api"
}
```

---

# 11. RAG Query API

Endpoint:

```text
POST /api/rag/query
```

Example request:

```json
{
  "question": "What does HTTP 429 mean?"
}
```

Example response:

```json
{
  "answer": "HTTP 429 means Too Many Requests.",
  "sources": [
    {
      "documentId": "http-errors.md"
    }
  ],
  "trace": {
    "requestId": "req-example"
  }
}
```

The exact response can contain additional observability information depending on implementation.

---

# 12. Request Tracing

Every RAG request should have a unique request ID.

Example:

```text
req_123
```

The same ID should appear in all logs associated with the request.

Example:

```json
{
  "event": "rag_request_started",
  "requestId": "req_123"
}
```

Then:

```json
{
  "event": "retrieval_completed",
  "requestId": "req_123",
  "latencyMs": 42
}
```

Then:

```json
{
  "event": "llm_completed",
  "requestId": "req_123",
  "latencyMs": 850
}
```

This makes debugging much easier.

---

# 13. Structured Logging

Instead of:

```javascript
console.log("retrieval completed");
```

use structured logs:

```javascript
console.log(
  JSON.stringify({
    event: "retrieval_completed",
    requestId,
    resultCount: results.length,
    latencyMs,
  }),
);
```

A production logging system can then search by:

```text
requestId
event
latency
error
documentId
```

---

# 14. Retrieval Evaluation

The project evaluates retrieval independently from generation.

This is important because:

```text
Bad retrieval
      ↓
Bad context
      ↓
Bad answer
```

The LLM cannot reliably answer using information that was never retrieved.

---

# 15. Recall@K

Recall@K answers:

```text
Did we retrieve the relevant documents?
```

Formula:

```text
Recall@K =
number of relevant documents retrieved in Top-K
------------------------------------------------
total number of relevant documents
```

Example:

```text
Relevant:

doc4
doc7
```

Retrieved:

```text
doc2
doc4
doc8
doc10
doc11
```

Therefore:

```text
Recall@5 = 1 / 2
         = 0.5
```

---

# 16. Precision@K

Precision@K answers:

```text
How many of the retrieved documents are actually relevant?
```

Formula:

```text
Precision@K =
relevant retrieved documents
----------------------------
total retrieved documents
```

Example:

```text
Top 5:

doc1 ❌
doc2 ✅
doc3 ❌
doc4 ✅
doc5 ❌
```

Therefore:

```text
Precision@5 = 2 / 5
            = 0.4
```

---

# 17. MRR

MRR means:

```text
Mean Reciprocal Rank
```

If the first relevant document is at:

```text
Rank 1
```

score:

```text
1 / 1 = 1
```

Rank 2:

```text
1 / 2 = 0.5
```

Rank 5:

```text
1 / 5 = 0.2
```

For multiple questions:

```text
MRR =
average reciprocal rank
of the first relevant result
```

Higher is better.

---

# 18. Evaluation Dataset

The golden dataset is located at:

```text
tests/evaluation.dataset.json
```

Example:

```json
[
  {
    "id": "q001",
    "question": "What does HTTP 429 mean?",
    "relevantDocuments": ["http-errors.md"],
    "expectedAnswer": "HTTP 429 means Too Many Requests."
  },
  {
    "id": "q002",
    "question": "What does HTTP 401 mean?",
    "relevantDocuments": ["http-errors.md"],
    "expectedAnswer": "HTTP 401 means Unauthorized."
  }
]
```

The dataset should grow as the application grows.

A useful initial target is:

```text
20–50 high-quality questions
```

Later:

```text
100+
```

---

# 19. Evaluation Categories

The golden dataset should contain different question types.

Recommended categories:

```text
Authentication
API errors
Node.js
Express
Databases
Security
Deployment
Configuration
Troubleshooting
```

Also include:

```text
Easy questions
Ambiguous questions
Multi-step questions
Negative questions
Out-of-domain questions
```

---

# 20. Evaluation Runner

The evaluation runner executes every question against the RAG system.

Conceptually:

```text
Golden Dataset
      ↓
Evaluation Runner
      ↓
RAG Query
      ↓
Retrieved Documents
      ↓
Calculate Metrics
      ↓
Generate Report
```

Metrics include:

```text
Recall@3
Recall@5
Recall@10
Precision@3
Precision@5
MRR
```

---

# 21. Evaluation API

Run evaluation:

```text
POST /api/evaluation/run
```

Example:

```bash
curl -X POST http://localhost:3000/api/evaluation/run
```

Possible response:

```json
{
  "totalQuestions": 20,
  "retrieval": {
    "recallAt3": 0.81,
    "recallAt5": 0.9,
    "recallAt10": 0.95,
    "precisionAt3": 0.74,
    "precisionAt5": 0.72,
    "mrr": 0.84
  }
}
```

The values above are examples only.

---

# 22. Metrics API

Endpoint:

```text
GET /api/evaluation/metrics
```

Example:

```json
{
  "retrieval": {
    "recallAt5": 0.9,
    "precisionAt5": 0.72,
    "mrr": 0.84
  }
}
```

The implementation can store the latest evaluation result in memory or persist it in a database.

---

# 23. Context Relevance

Retrieval quality is not the complete story.

Example:

```text
Question:
How do I refresh a JWT?
```

Retrieved context:

```text
JWT is a token format.

JWT contains header, payload and signature.

OAuth is an authorization framework.

Refresh tokens can obtain a new access token.
```

Some chunks are useful while others are unrelated.

Therefore we measure:

```text
Context Relevance
```

The objective is:

```text
Relevant context
        ↓
LLM
        ↓
Grounded answer
```

---

# 24. Faithfulness

Faithfulness asks:

```text
Is the generated answer supported by the retrieved context?
```

Example context:

```text
HTTP 429 means Too Many Requests.
```

Good answer:

```text
HTTP 429 means Too Many Requests.
```

Potentially unfaithful answer:

```text
HTTP 429 means Too Many Requests and the server
will always retry exactly 30 seconds later.
```

If the context does not support the second claim, the answer is not fully faithful.

---

# 25. Answer Correctness

Answer correctness asks:

```text
Does the generated answer actually answer the question correctly?
```

This is different from faithfulness.

An answer can be:

```text
Faithful but incomplete
```

or:

```text
Relevant but unsupported
```

A mature evaluation system should measure these dimensions separately.

---

# 26. Out-of-Domain Questions

The RAG application may have a limited knowledge base.

For example:

```text
Knowledge base:
Node.js documentation
```

User asks:

```text
What is the population of Japan?
```

The system should not invent an answer.

A possible flow is:

```text
Question
   ↓
Retrieval
   ↓
Similarity threshold
   ↓
No sufficiently relevant context
   ↓
Insufficient-information response
```

This reduces hallucination risk.

---

# 27. Failure Classification

Failures should be categorized.

Example:

```javascript
export const FAILURE_TYPES = {
  RETRIEVAL_FAILURE: "retrieval_failure",
  RERANKING_FAILURE: "reranking_failure",
  CONTEXT_FAILURE: "context_failure",
  GENERATION_FAILURE: "generation_failure",
  TIMEOUT: "timeout",
  PROVIDER_ERROR: "provider_error",
};
```

Example:

```text
Question:
What is HTTP 429?
```

Expected:

```text
http-errors.md
```

Retrieved:

```text
jwt-guide.md
node-routing.md
javascript-basics.md
```

Classification:

```text
retrieval_failure
```

---

# 28. Latency Monitoring

Track every major component:

```text
Query rewrite
Embedding
Vector search
Keyword search
Hybrid ranking
Reranking
Context building
LLM generation
```

Do not only track total latency.

Example:

```text
Query rewrite       100ms
Embedding            70ms
Vector search        45ms
Keyword search       30ms
Reranking           180ms
Context building      5ms
LLM                  950ms
--------------------------------
Total              1380ms
```

Now the bottleneck is visible.

---

# 29. P50 Latency

P50 is approximately the median latency.

If:

```text
50% of requests
```

are faster than:

```text
720ms
```

then:

```text
P50 ≈ 720ms
```

P50 represents typical user experience.

---

# 30. P95 Latency

P95 shows tail latency.

If:

```text
95% of requests
```

are below:

```text
1800ms
```

then:

```text
P95 = 1800ms
```

P95 is often more useful than average latency for production monitoring.

---

# 31. P99 Latency

P99 measures a more extreme part of the latency distribution.

It helps identify:

```text
Very slow requests
Timeout conditions
Infrastructure problems
Large retrieval workloads
Provider delays
```

---

# 32. Token Tracking

Each LLM request should track:

```text
Input tokens
Output tokens
Total tokens
```

Example:

```json
{
  "inputTokens": 2100,
  "outputTokens": 300,
  "totalTokens": 2400
}
```

This helps identify expensive requests.

---

# 33. Cost Tracking

Cost should be configurable because provider pricing can change.

Conceptually:

```text
Input Cost =
input tokens × input price
```

```text
Output Cost =
output tokens × output price
```

```text
Total Cost =
Input Cost + Output Cost
```

Do not hard-code pricing assumptions throughout the application.

Keep pricing configuration centralized.

---

# 34. RAG Trace

A complete trace can contain:

```javascript
{
  requestId,
  query,
  rewrittenQuery,

  retrieval: {
    vectorResults,
    keywordResults,
    hybridResults,
    rerankedResults
  },

  context: {
    chunks,
    tokenCount
  },

  generation: {
    model,
    inputTokens,
    outputTokens,
    latencyMs
  },

  totalLatencyMs,

  errors
}
```

This trace can be used for:

```text
Debugging
Monitoring
Evaluation
Cost analysis
Performance optimization
Failure analysis
```

---

# 35. Example Production Trace

```text
requestId: req_001

QUERY
 └── How does JWT refresh work?

REWRITE
 └── JWT refresh token authentication flow

RETRIEVAL
 ├── vector results: 10
 ├── keyword results: 10
 └── hybrid results: 15

RERANKING
 └── top results: 5

CONTEXT
 ├── chunks: 3
 └── tokens: 1800

LLM
 ├── provider: Groq
 ├── model: openai/gpt-oss-20b
 ├── input: 2100 tokens
 ├── output: 300 tokens
 └── latency: 950ms

TOTAL
 └── 1.4 seconds
```

---

# 36. Regression Testing

Suppose the baseline is:

```text
Recall@5 = 0.91
```

You change the chunking algorithm.

After the change:

```text
Recall@5 = 0.72
```

The system has regressed.

The evaluation dataset allows us to detect this automatically.

Pipeline:

```text
Code Change
    ↓
Run Tests
    ↓
Run RAG Evaluation
    ↓
Calculate Metrics
    ↓
Compare Baseline
    ↓
Pass / Fail
```

---

# 37. Recommended Regression Rule

A simple rule might be:

```text
Recall@5 must not decrease by more than 5%.
```

Example:

```text
Baseline:
0.91

Allowed minimum:
0.8645
```

If the new score is:

```text
0.72
```

the build should fail.

The exact threshold should be decided based on your application.

---

# 38. Unit Tests

Run:

```bash
npm test
```

Tests should cover:

```text
Recall@K
Precision@K
MRR
Mean calculation
Latency calculations
Cost calculations
Failure classification
Evaluation runner
```

Example:

```text
retrieval.test.js
metrics.test.js
rag.evaluation.test.js
```

---

# 39. Testing Without Calling Groq

Unit tests should not depend on a live Groq API.

Prefer mocked data for:

```text
Retrieval
LLM
Embeddings
Reranking
```

This gives:

```text
Fast tests
Deterministic tests
No API cost
No network dependency
```

Live Groq calls should be used in a separate integration/evaluation workflow when needed.

---

# 40. Groq LLM Layer

The application should isolate the provider behind an LLM service.

Conceptually:

```text
RAG Application
      ↓
LLM Service
      ↓
Groq
      ↓
openai/gpt-oss-20b
```

This means the rest of the application does not need to know provider-specific details.

---

# 41. Environment Variables

Recommended:

```env
PORT=3000

GROQ_API_KEY=your_groq_api_key

GROQ_MODEL=openai/gpt-oss-20b
```

Optional pricing configuration:

```env
LLM_INPUT_PRICE_PER_MILLION=0
LLM_OUTPUT_PRICE_PER_MILLION=0
```

Use current provider pricing when configuring real production cost tracking.

---

# 42. API Endpoints

## Health

```text
GET /health
```

## RAG Query

```text
POST /api/rag/query
```

## Run Evaluation

```text
POST /api/evaluation/run
```

## Evaluation Metrics

```text
GET /api/evaluation/metrics
```

---

# 43. Example API Flow

Request:

```text
POST /api/rag/query
```

Body:

```json
{
  "question": "What does HTTP 429 mean?"
}
```

Processing:

```text
Request
   ↓
Request ID
   ↓
Query Processing
   ↓
Hybrid Retrieval
   ↓
Reranking
   ↓
Context Construction
   ↓
Groq LLM
   ↓
Answer
   ↓
Trace
   ↓
Response
```

---

# 44. Example Evaluation Flow

```text
POST /api/evaluation/run
```

Processing:

```text
Load Golden Dataset
        ↓
For Each Question
        ↓
Run RAG
        ↓
Collect Retrieved Documents
        ↓
Calculate Recall@K
        ↓
Calculate Precision@K
        ↓
Calculate MRR
        ↓
Calculate Latency
        ↓
Collect Errors
        ↓
Generate Report
```

---

# 45. Example Evaluation Report

```text
========================================
RAG EVALUATION REPORT
========================================

Questions: 100

RETRIEVAL
----------------------------------------
Recall@3:       0.81
Recall@5:       0.91
Recall@10:      0.96

PRECISION
----------------------------------------
Precision@3:    0.74
Precision@5:    0.69

RANKING
----------------------------------------
MRR:            0.87

LATENCY
----------------------------------------
P50:            820ms
P95:            1900ms
P99:            3100ms

GENERATION
----------------------------------------
Faithfulness:   0.92
Correctness:    0.89
```

These numbers are illustrative.

---

# 46. Production Dashboard

A production dashboard could expose:

```text
┌──────────────────────────────────────┐
│             RAG SYSTEM               │
├──────────────────────────────────────┤
│ Requests              52,340         │
│ Error Rate              0.8%         │
│ P50 Latency             720ms        │
│ P95 Latency            1.8s          │
│ Recall@5                0.91         │
│ MRR                     0.87         │
│ Avg Tokens              2,430        │
│ Avg Cost                configurable │
└──────────────────────────────────────┘
```

---

# 47. Production Monitoring

Monitor at least:

## Reliability

```text
Request count
Error rate
Timeout rate
Provider errors
```

## Retrieval

```text
Recall@K
Precision@K
MRR
Empty retrieval rate
Low-confidence retrieval rate
```

## Generation

```text
Faithfulness
Answer correctness
Context relevance
Refusal rate
```

## Performance

```text
P50
P95
P99
```

## Cost

```text
Input tokens
Output tokens
Total tokens
Cost per request
Daily cost
Monthly cost
```

---

# 48. Security

Never log:

```text
API keys
Passwords
Authorization headers
Private credentials
Sensitive personal data
Entire private documents
```

Use appropriate:

```text
Redaction
Encryption
Access control
Retention policies
```

Observability data can itself contain sensitive information.

---

# 49. Git Workflow

Evaluation:

```bash
git add src/evaluation
git commit -m "feat(day85): add RAG evaluation metrics"
```

Observability:

```bash
git add src/observability
git commit -m "feat(day85): add RAG observability and tracing"
```

Latency:

```bash
git add src/observability/timer.js
git commit -m "feat(day85): add RAG latency tracking"
```

Cost:

```bash
git add src/observability/cost.tracker.js
git commit -m "feat(day85): add LLM token and cost tracking"
```

Golden dataset:

```bash
git add tests/evaluation.dataset.json
git commit -m "test(day85): add RAG golden evaluation dataset"
```

Tests:

```bash
git add tests
git commit -m "test(day85): add RAG evaluation regression tests"
```

API:

```bash
git add src/routes
git commit -m "feat(day85): add RAG evaluation API"
```

Documentation:

```bash
git add notes/day85_notes.md
git commit -m "docs(day85): document RAG evaluation and observability"
```

Push:

```bash
git push origin master
```

---

# 50. Troubleshooting

## Vitest Native Binding Error

If you see:

```text
Error: Cannot find native binding
```

or:

```text
Cannot find module '@rolldown/binding-wasm32-wasi'
```

first remove:

```text
node_modules
package-lock.json
```

PowerShell:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```

Then:

```bash
npm test
```

If the problem continues, verify your Node.js version and the installed Vitest/Rolldown dependency versions.

---

# 51. Day 85 Checklist

## Retrieval Evaluation

```text
☐ Recall@3
☐ Recall@5
☐ Recall@10
☐ Precision@3
☐ Precision@5
☐ MRR
```

## Generation Evaluation

```text
☐ Context relevance
☐ Faithfulness
☐ Answer correctness
```

## Dataset

```text
☐ Golden dataset
☐ Representative questions
☐ Easy questions
☐ Ambiguous questions
☐ Negative questions
☐ Out-of-domain questions
```

## Observability

```text
☐ Request ID
☐ Structured logs
☐ Request trace
☐ Component timing
☐ Token tracking
☐ Cost tracking
```

## Production Quality

```text
☐ P50
☐ P95
☐ P99
☐ Failure classification
☐ Regression detection
☐ Out-of-domain detection
☐ Evaluation API
☐ Metrics API
```

---

# 52. Interview Questions

## Q1. What is Recall@K?

Recall@K measures how many relevant documents were retrieved within the top K results compared with the total number of relevant documents.

---

## Q2. What is Precision@K?

Precision@K measures the proportion of the top K retrieved documents that are relevant.

---

## Q3. What is MRR?

Mean Reciprocal Rank measures how highly the first relevant result appears in a ranked retrieval result set.

---

## Q4. Why is retrieval evaluation important?

Because an LLM cannot reliably answer from information that the retriever failed to provide.

---

## Q5. What is RAG observability?

RAG observability is the ability to inspect and measure the internal behavior of a RAG request, including retrieval, reranking, context construction, generation, latency, tokens, costs and errors.

---

## Q6. Why use request IDs?

Request IDs allow all logs and operations belonging to one request to be correlated.

---

## Q7. What is P95 latency?

P95 is the latency threshold below which approximately 95% of observed requests fall.

---

## Q8. What is faithfulness?

Faithfulness measures whether the generated answer is supported by the retrieved context.

---

## Q9. What is a golden dataset?

A curated dataset containing representative questions and expected retrieval and/or answer behavior used for RAG evaluation and regression testing.

---

## Q10. Why should unit tests avoid live LLM calls?

Live calls introduce:

```text
Network dependency
Latency
API cost
Non-deterministic output
Provider availability issues
```

Mocking makes unit tests faster and deterministic.

---

# 53. Day 84 → Day 85

Day 84 focused on:

```text
Advanced RAG
Hybrid Retrieval
Reranking
Query Processing
Context Selection
```

Day 85 adds:

```text
Evaluation
Observability
Tracing
Metrics
Cost
Latency
Regression Testing
Production Quality
```

The architecture evolves from:

```text
USER
 ↓
Query
 ↓
Hybrid Retrieval
 ↓
Reranker
 ↓
Context
 ↓
LLM
 ↓
Answer
```

to:

```text
                         ┌────────────────────┐
                         │   OBSERVABILITY    │
                         │                    │
                         │ Logs               │
                         │ Traces             │
                         │ Latency            │
                         │ Tokens             │
                         │ Cost               │
                         │ Errors             │
                         └─────────┬──────────┘
                                   │
                                   ▼

USER
 ↓
Query
 ↓
Query Rewrite
 ↓
Hybrid Retrieval
 ↓
Reranking
 ↓
Context Builder
 ↓
Groq
 ↓
openai/gpt-oss-20b
 ↓
Answer + Sources
 ↓
Evaluation
 ↓
Metrics
```

---

# 54. Production Mindset

Do not stop at:

```text
"It works."
```

Ask:

```text
Does it work reliably?

Can I measure it?

Can I debug it?

Can I reproduce failures?

Can I detect regressions?

Can I control cost?

Can I monitor latency?

Can I measure retrieval quality?

Can I determine why an answer was wrong?

Can I detect hallucinations?
```

This is the difference between:

```text
AI DEMO
```

and:

```text
PRODUCTION AI ENGINEERING
```

---

# 55. Day 85 Core Principle

> You cannot improve a production RAG system reliably unless you can measure it.

The progression is:

```text
DAY 83
Embeddings + Vector Memory
        ↓
DAY 84
Advanced RAG
        ↓
DAY 85
Evaluation + Observability
        ↓
DAY 86
Production RAG Reliability + Guardrails
```

Day 85 marks the transition from:

```text
Building RAG
```

to:

```text
Engineering measurable, observable,
testable and production-quality RAG.
```

---

# 56. Final Success Criteria

Day 85 is complete when you can:

```text
☑ Run the RAG application
☑ Call Groq successfully
☑ Use openai/gpt-oss-20b
☑ Retrieve documents
☑ Evaluate retrieval
☑ Calculate Recall@K
☑ Calculate Precision@K
☑ Calculate MRR
☑ Run a golden dataset
☑ Track request IDs
☑ Generate structured logs
☑ Measure component latency
☑ Calculate P50/P95
☑ Track tokens
☑ Track cost
☑ Classify failures
☑ Detect weak retrieval
☑ Detect out-of-domain queries
☑ Run regression evaluation
☑ Expose evaluation APIs
☑ Explain RAG quality in an interview
```

---

# 57. Next Step — Day 86

The next stage is:

```text
DAY 86
Production RAG Reliability & Guardrails
```

Expected topics:

```text
Rate limiting
Retries
Timeouts
Circuit breakers
Fallback models
Input validation
Prompt injection defense
Output validation
PII protection
Content filtering
Confidence thresholds
Safe refusals
Provider failures
Graceful degradation
Production reliability
```

The overall progression becomes:

```text
Memory
  ↓
Embeddings
  ↓
Vector Search
  ↓
Advanced RAG
  ↓
Hybrid Retrieval
  ↓
Reranking
  ↓
Evaluation
  ↓
Observability
  ↓
Reliability
  ↓
Guardrails
  ↓
Production AI Engineering
```
