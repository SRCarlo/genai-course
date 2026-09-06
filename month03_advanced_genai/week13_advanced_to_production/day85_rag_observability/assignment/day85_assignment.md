# DAY 85 ASSIGNMENT

## Production RAG Evaluation & Observability Platform

### Week 13 — Advanced → Production

---

# 1. Assignment Objective

Extend the Day 84 Advanced RAG project into a measurable and observable production-style RAG system.

The final system should answer not only:

> "Can the RAG system answer questions?"

but also:

> "How good is retrieval?"

> "How relevant is the context?"

> "Is the answer grounded?"

> "How fast is the system?"

> "How many tokens did it use?"

> "How much did the request cost?"

> "Why did a request fail?"

> "Did a code change make retrieval worse?"

---

# 2. Project Name

```text
Production RAG Evaluation & Observability Platform
```

Project directory:

```text
day85_rag_observability/
```

---

# 3. Starting Point

Use the Day 84 Advanced RAG project as the foundation.

Day 84 already contains concepts such as:

```text
Query processing
Hybrid retrieval
Vector search
Keyword search
Reranking
Context construction
LLM generation
Sources
```

Day 85 adds:

```text
Evaluation
Observability
Tracing
Metrics
Latency
Token tracking
Cost tracking
Failure classification
Regression testing
```

---

# 4. Technology Requirement

Use:

```text
Node.js
Express
JavaScript ES Modules
Vitest
Groq API
```

For LLM generation, use:

```text
openai/gpt-oss-20b
```

through the Groq API.

Environment variables:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-20b
```

Never commit `.env`.

---

# 5. Expected Project Structure

Create:

```text
day85_rag_observability/
│
├── src/
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

# 6. Part 1 — Golden Evaluation Dataset

Create:

```text
tests/evaluation.dataset.json
```

Minimum:

```text
20 questions
```

Recommended:

```text
30–50 questions
```

Advanced target:

```text
100+ questions
```

Each test should contain:

```json
{
  "id": "q001",
  "question": "What does HTTP 429 mean?",
  "relevantDocuments": ["http-errors.md"],
  "expectedAnswer": "HTTP 429 means Too Many Requests."
}
```

---

# 7. Dataset Categories

Your dataset must contain multiple categories.

Minimum categories:

```text
Authentication
API errors
Node.js
Express
Database
Security
Deployment
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

# 8. Dataset Requirements

Your dataset should test:

### Direct retrieval

```text
What does HTTP 429 mean?
```

### Conceptual retrieval

```text
Why should JWT refresh tokens be protected?
```

### Multi-document retrieval

```text
How does authentication work across the API and database layers?
```

### Ambiguous question

```text
Tell me something about authentication.
```

### Out-of-domain question

```text
What is the capital of France?
```

---

# 9. Part 2 — Recall@K

Create:

```text
src/evaluation/retrieval.evaluator.js
```

Implement:

```text
recallAtK()
```

It should support:

```text
Recall@3
Recall@5
Recall@10
```

Formula:

```text
Recall@K =
relevant documents retrieved in Top-K
--------------------------------------
total relevant documents
```

Example:

```text
Relevant:
doc1
doc2

Top 5:
doc1
doc5
doc6
doc7
doc8
```

Result:

```text
Recall@5 = 1 / 2
          = 0.5
```

---

# 10. Part 3 — Precision@K

Implement:

```text
precisionAtK()
```

Support:

```text
Precision@3
Precision@5
Precision@10
```

Formula:

```text
Precision@K =
relevant retrieved documents
----------------------------
retrieved documents
```

Example:

```text
Top 5:

doc1 ✅
doc2 ❌
doc3 ❌
doc4 ✅
doc5 ❌
```

Then:

```text
Precision@5 = 2 / 5
            = 0.4
```

---

# 11. Part 4 — MRR

Implement:

```text
reciprocalRank()
```

and:

```text
mean()
```

Then calculate:

```text
MRR
```

Example:

```text
Query 1 → relevant document rank 1
Query 2 → relevant document rank 2
Query 3 → relevant document rank 5
```

Scores:

```text
1
0.5
0.2
```

MRR:

```text
(1 + 0.5 + 0.2) / 3
= 0.5667
```

---

# 12. Part 5 — Retrieval Evaluation Runner

Create:

```text
src/evaluation/evaluation.runner.js
```

The runner must:

1. Load the evaluation dataset.
2. Execute each question against the RAG system.
3. Capture retrieved sources.
4. Calculate Recall@3.
5. Calculate Recall@5.
6. Calculate Recall@10.
7. Calculate Precision@3.
8. Calculate Precision@5.
9. Calculate Precision@10.
10. Calculate MRR.
11. Collect latency.
12. Collect failures.

---

# 13. Part 6 — Evaluation Report

The evaluation runner should generate a report similar to:

```text
=================================
RAG EVALUATION REPORT
=================================

Questions: 20

Retrieval
---------
Recall@3:      0.85
Recall@5:      0.90
Recall@10:     0.95

Precision
---------
Precision@3:   0.76
Precision@5:   0.72
Precision@10:  0.61

Ranking
-------
MRR:           0.84

Latency
-------
P50:           720ms
P95:           1800ms

Failures
--------
Retrieval:     1
Generation:    0
Timeout:       0
```

The numbers are examples.

Your report must contain your actual results.

---

# 14. Part 7 — Request IDs

Create:

```text
src/observability/request.context.js
```

Implement unique request ID generation.

Example:

```text
req_001
```

or UUID-style IDs.

Every RAG request should have a request ID.

The same ID should appear in:

```text
Query logs
Retrieval logs
Reranking logs
Context logs
LLM logs
Error logs
Final response
```

---

# 15. Part 8 — Structured Logging

Create:

```text
src/observability/logger.js
```

Implement structured logging.

Avoid:

```javascript
console.log("retrieval finished");
```

Prefer:

```json
{
  "event": "retrieval_completed",
  "requestId": "req_123",
  "resultCount": 10,
  "latencyMs": 45
}
```

Minimum events:

```text
rag_request_started
query_rewrite_completed
retrieval_started
retrieval_completed
reranking_completed
context_built
llm_started
llm_completed
rag_request_completed
rag_request_failed
```

---

# 16. Part 9 — Timer

Create:

```text
src/observability/timer.js
```

Implement a reusable timing utility.

It should measure:

```text
Query rewrite
Embedding
Vector retrieval
Keyword retrieval
Hybrid retrieval
Reranking
Context building
LLM generation
```

Example:

```javascript
const result = await measure("vector_search", () => vectorSearch(query));
```

Return:

```javascript
{
  (result, operation, latencyMs);
}
```

---

# 17. Part 10 — RAG Trace

Create:

```text
src/observability/trace.js
```

The trace should contain at least:

```text
requestId
query
rewrittenQuery

retrieval
  vectorResults
  keywordResults
  hybridResults
  rerankedResults

context
  chunks
  tokenCount

generation
  model
  inputTokens
  outputTokens
  latencyMs

totalLatencyMs

errors
```

---

# 18. Part 11 — Token Tracking

Track:

```text
Input tokens
Output tokens
Total tokens
```

For the Groq LLM response, inspect the provider response metadata when available.

Store:

```json
{
  "inputTokens": 2000,
  "outputTokens": 400,
  "totalTokens": 2400
}
```

Token information should be included in the trace.

---

# 19. Part 12 — Groq Model Tracking

The trace should identify:

```text
provider: groq
model: openai/gpt-oss-20b
```

Example:

```json
{
  "provider": "groq",
  "model": "openai/gpt-oss-20b"
}
```

Do not hard-code the API key.

Use:

```env
GROQ_API_KEY=
GROQ_MODEL=openai/gpt-oss-20b
```

---

# 20. Part 13 — Cost Tracking

Create:

```text
src/observability/cost.tracker.js
```

Implement:

```text
calculateCost()
```

Input:

```text
inputTokens
outputTokens
inputPricePerMillion
outputPricePerMillion
```

Output:

```text
total cost
```

Do not hard-code provider pricing into the application.

Pricing should be configurable.

---

# 21. Part 14 — Failure Classification

Create:

```text
src/evaluation/failure.classifier.js
```

Implement categories:

```text
retrieval_failure
reranking_failure
context_failure
generation_failure
timeout
provider_error
```

Example:

```text
Question:
What does HTTP 429 mean?

Expected:
http-errors.md

Retrieved:
javascript-basics.md
jwt-guide.md
node-routing.md
```

Classify:

```text
retrieval_failure
```

---

# 22. Part 15 — Out-of-Domain Detection

The system should identify questions that cannot be answered from the knowledge base.

Example:

```text
Knowledge Base:
Node.js documentation

Question:
What is the population of Japan?
```

If retrieval relevance is below the configured threshold:

```text
Do not force generation.
```

Instead return an appropriate response such as:

```text
I don't have enough information in the knowledge base to answer that.
```

The threshold must be configurable.

---

# 23. Part 16 — Context Relevance

Add context-quality evaluation.

For every query, determine whether retrieved chunks are relevant.

At minimum, implement a simple deterministic evaluator based on:

```text
Relevant document IDs
```

Advanced implementation may use an LLM judge.

If an LLM judge is used, use the Groq API rather than OpenAI.

---

# 24. Part 17 — Faithfulness

Evaluate whether the answer is supported by retrieved context.

Example:

Context:

```text
HTTP 429 means Too Many Requests.
```

Answer:

```text
HTTP 429 means Too Many Requests.
```

Good.

If the answer adds unsupported information:

```text
HTTP 429 means Too Many Requests and the server
always retries exactly three times.
```

and the context does not support that claim, classify it as a faithfulness problem.

---

# 25. Part 18 — API Endpoint

Implement:

```text
POST /api/rag/query
```

Request:

```json
{
  "question": "What does HTTP 429 mean?"
}
```

Response should contain:

```json
{
  "requestId": "req_123",
  "answer": "HTTP 429 means Too Many Requests.",
  "sources": [
    {
      "documentId": "http-errors.md"
    }
  ],
  "metrics": {
    "latencyMs": 850,
    "inputTokens": 1000,
    "outputTokens": 100,
    "totalTokens": 1100
  }
}
```

---

# 26. Part 19 — Evaluation API

Implement:

```text
POST /api/evaluation/run
```

It should execute the complete golden dataset.

Example response:

```json
{
  "totalQuestions": 20,
  "retrieval": {
    "recallAt3": 0.85,
    "recallAt5": 0.9,
    "recallAt10": 0.95,
    "precisionAt3": 0.76,
    "precisionAt5": 0.72,
    "precisionAt10": 0.61,
    "mrr": 0.84
  },
  "latency": {
    "p50": 720,
    "p95": 1800
  }
}
```

---

# 27. Part 20 — Metrics Endpoint

Implement:

```text
GET /api/evaluation/metrics
```

Return the latest evaluation metrics.

Example:

```json
{
  "recallAt5": 0.9,
  "precisionAt5": 0.72,
  "mrr": 0.84,
  "p50": 720,
  "p95": 1800
}
```

---

# 28. Part 21 — Health Endpoint

Implement:

```text
GET /health
```

Expected:

```json
{
  "status": "ok",
  "service": "rag-api"
}
```

---

# 29. Part 22 — Unit Tests

Create:

```text
tests/retrieval.test.js
tests/metrics.test.js
```

Test:

```text
Recall@3
Recall@5
Recall@10
Precision@3
Precision@5
Precision@10
MRR
mean
P50
P95
Cost calculation
Failure classification
```

Minimum test cases should include:

```text
All relevant documents retrieved
Some relevant documents retrieved
No relevant documents retrieved
Empty result list
K larger than result count
Multiple relevant documents
Relevant document at rank 1
Relevant document at rank 5
No relevant document
```

---

# 30. Part 23 — Regression Tests

Create:

```text
tests/rag.evaluation.test.js
```

Run the golden dataset.

Define acceptable quality thresholds.

Example:

```text
Recall@5 >= 0.80
MRR >= 0.70
```

These are example thresholds.

Choose thresholds based on your actual application.

If a metric falls below the threshold:

```text
Test must fail.
```

---

# 31. Part 24 — P50 and P95

Collect latency for every evaluation question.

Example:

```text
[400, 500, 600, 700, 800, 900, 1000]
```

Calculate:

```text
P50
P95
```

Also optionally calculate:

```text
P99
```

Do not rely only on average latency.

---

# 32. Part 25 — Production Dashboard Data

Your backend should expose enough data for a dashboard.

Track:

```text
Request count
Error count
Error rate
P50
P95
P99

Recall@3
Recall@5
Recall@10

Precision@3
Precision@5
Precision@10

MRR

Average input tokens
Average output tokens
Average total tokens

Average cost

Retrieval failures
Reranking failures
Generation failures
Provider errors
Timeouts
```

A frontend dashboard is optional.

The backend metrics API is required.

---

# 33. Part 26 — Error Handling

The application should gracefully handle:

```text
Missing GROQ_API_KEY
Groq provider errors
LLM timeout
Empty retrieval results
Invalid request
Evaluation dataset errors
Malformed LLM responses
```

Do not expose internal secrets or stack traces to API clients.

---

# 34. Part 27 — Security

Never log:

```text
GROQ_API_KEY
Authorization headers
Passwords
Secrets
Private credentials
```

Avoid storing sensitive user data in traces unless necessary.

Use:

```text
Redaction
Access control
Retention policies
```

where appropriate.

---

# 35. Part 28 — README

Update:

```text
README.md
```

It should explain:

```text
Project overview
Architecture
Installation
Environment variables
How to run
How to test
How to run evaluation
API endpoints
Evaluation metrics
Observability
Groq integration
Model configuration
Known limitations
```

Include:

```text
GROQ_MODEL=openai/gpt-oss-20b
```

in the environment-variable documentation.

Never include an actual API key.

---

# 36. Part 29 — Environment File

Create:

```text
.env.example
```

Example:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-20b

PORT=3000

# Optional evaluation thresholds
MIN_RECALL_AT_5=0.80
MIN_MRR=0.70

# Optional out-of-domain threshold
RETRIEVAL_SCORE_THRESHOLD=0.50
```

Your actual `.env` must not be committed.

---

# 37. Part 30 — Gitignore

Ensure `.gitignore` contains:

```text
node_modules/
.env
.env.local
coverage/
*.log
```

---

# 38. Required Git Commits

## Evaluation

```bash
git add src/evaluation
git commit -m "feat(day85): add RAG evaluation metrics"
```

## Observability

```bash
git add src/observability
git commit -m "feat(day85): add RAG observability and tracing"
```

## Latency

```bash
git add src/observability/timer.js
git commit -m "feat(day85): add RAG latency tracking"
```

## Cost

```bash
git add src/observability/cost.tracker.js
git commit -m "feat(day85): add LLM token and cost tracking"
```

## Dataset

```bash
git add tests/evaluation.dataset.json
git commit -m "test(day85): add RAG golden evaluation dataset"
```

## Tests

```bash
git add tests
git commit -m "test(day85): add RAG evaluation regression tests"
```

## API

```bash
git add src/routes
git commit -m "feat(day85): add RAG evaluation API"
```

## Documentation

```bash
git add notes/day85_notes.md assignment/day85_assignment.md README.md
git commit -m "docs(day85): document RAG evaluation and observability"
```

---

# 39. Final Git Push

After verifying all tests:

```bash
git status
```

Then:

```bash
git push origin master
```

If your repository uses `main`:

```bash
git push origin main
```

---

# 40. Basic Assignment Checklist

```text
☐ Evaluation dataset created
☐ At least 20 evaluation questions
☐ Recall@3
☐ Recall@5
☐ Recall@10
☐ Precision@3
☐ Precision@5
☐ Precision@10
☐ MRR
☐ Request ID
☐ Structured logger
☐ Timer
☐ Retrieval latency
☐ LLM latency
☐ Unit tests
☐ Evaluation runner
☐ Evaluation report
```

---

# 41. Intermediate Assignment Checklist

```text
☐ P50 latency
☐ P95 latency
☐ P99 latency
☐ Input token tracking
☐ Output token tracking
☐ Total token tracking
☐ Cost tracking
☐ Failure classification
☐ Context relevance
☐ Source tracking
☐ Out-of-domain detection
☐ Evaluation API
☐ Metrics API
☐ Health endpoint
```

---

# 42. Advanced Assignment Checklist

```text
☐ Golden dataset
☐ Automated evaluation
☐ Recall@3
☐ Recall@5
☐ Recall@10
☐ Precision@3
☐ Precision@5
☐ Precision@10
☐ MRR
☐ Context relevance
☐ Faithfulness
☐ Answer correctness
☐ Request tracing
☐ Structured logs
☐ Component latency
☐ P50
☐ P95
☐ P99
☐ Token monitoring
☐ Cost tracking
☐ Failure classification
☐ Out-of-domain detection
☐ Regression detection
☐ Evaluation API
☐ Metrics API
☐ Production dashboard data
☐ Groq API
☐ openai/gpt-oss-20b
```

---

# 43. Expected Final Architecture

```text
                         ┌─────────────────────┐
                         │   OBSERVABILITY     │
                         │                     │
                         │ Logs                │
                         │ Request IDs         │
                         │ Traces              │
                         │ Latency             │
                         │ Tokens              │
                         │ Cost                │
                         └──────────┬──────────┘
                                    │
                                    │
USER                                │
 │                                  │
 ▼                                  │
Question                            │
 │                                  │
 ▼                                  │
Query Rewrite                       │
 │                                  │
 ▼                                  │
Hybrid Retrieval                    │
 │                                  │
 ▼                                  │
Reranking                           │
 │                                  │
 ▼                                  │
Context Builder                     │
 │                                  │
 ▼                                  │
Groq API                            │
 │                                  │
 ▼                                  │
openai/gpt-oss-20b                  │
 │                                  │
 ▼                                  │
Answer + Sources                    │
 │                                  │
 ▼                                  │
Evaluation ─────────────────────────┘
 │
 ├── Recall@K
 ├── Precision@K
 ├── MRR
 ├── Context Relevance
 ├── Faithfulness
 └── Correctness
```

---

# 44. Final Evaluation Report

Your completed project should be able to produce something similar to:

```text
=============================================
DAY 85 — RAG QUALITY REPORT
=============================================

Dataset
-------
Questions:              30

Retrieval
---------
Recall@3:               0.83
Recall@5:               0.91
Recall@10:              0.96

Precision
---------
Precision@3:            0.77
Precision@5:            0.71
Precision@10:           0.60

Ranking
-------
MRR:                    0.86

Generation
----------
Faithfulness:           0.91
Correctness:            0.88

Latency
-------
P50:                    710ms
P95:                    1.82s
P99:                    2.60s

Tokens
------
Avg Input Tokens:       2100
Avg Output Tokens:      320
Avg Total Tokens:       2420

Failures
--------
Retrieval:              1
Reranking:              0
Context:                0
Generation:             0
Timeout:                0
Provider:               0

Model
------
Provider:               Groq
Model:                  openai/gpt-oss-20b

Status
------
PASS
=============================================
```

The values above are illustrative. Your actual report must contain measured results.

---

# 45. Self-Review Questions

Before completing Day 85, answer these questions without looking at the notes:

### Retrieval

1. What does Recall@K measure?
2. What does Precision@K measure?
3. Why is Recall important for RAG?
4. Why is Precision important?
5. What is MRR?
6. Why does ranking matter?

### Generation

7. What is context relevance?
8. What is faithfulness?
9. What is answer correctness?
10. How can hallucinations happen even when retrieval succeeds?

### Observability

11. Why do we need request IDs?
12. Why use structured logs?
13. Why measure component-level latency?
14. What is P50?
15. What is P95?
16. What is P99?

### Cost

17. Why track input tokens?
18. Why track output tokens?
19. How is LLM cost calculated?
20. Why should provider pricing be configurable?

### Reliability

21. What is a retrieval failure?
22. What is a generation failure?
23. What is an out-of-domain query?
24. Why should RAG support uncertainty?
25. What is regression testing?

### Production

26. What is a golden dataset?
27. Why should evaluation run in CI?
28. What metrics should appear on a production RAG dashboard?
29. What information should never be logged?
30. How would you determine why a RAG answer was incorrect?

---

# 46. Final Deliverables

Submit the following:

```text
☐ Complete day85_rag_observability project
☐ notes/day85_notes.md
☐ assignment/day85_assignment.md
☐ README.md
☐ .env.example
☐ Evaluation dataset
☐ Retrieval evaluator
☐ Metrics implementation
☐ Evaluation runner
☐ Failure classifier
☐ Logger
☐ Timer
☐ Request ID
☐ Trace implementation
☐ Cost tracker
☐ RAG API
☐ Evaluation API
☐ Metrics API
☐ Health API
☐ Unit tests
☐ Regression tests
☐ Git commits
☐ Git push
```

---

# 47. Definition of Done

Day 85 is complete when:

```text
npm test
```

passes successfully,

and:

```text
POST /api/rag/query
```

can execute a RAG request through:

```text
Groq
    ↓
openai/gpt-oss-20b
```

and produce:

```text
Answer
Sources
Request ID
Latency
Token usage
```

and:

```text
POST /api/evaluation/run
```

can execute the golden dataset and report:

```text
Recall@K
Precision@K
MRR
Latency
Failures
```

and the system can explain:

```text
What happened?
How long did it take?
How many tokens were used?
How much did it cost?
Was retrieval successful?
Was the answer grounded?
Did the system fail?
```

---

# 48. Day 85 Core Principle

> You cannot improve a production RAG system reliably unless you can measure it.

The final progression is:

```text
DAY 83
Embeddings + Vector Memory
        ↓
DAY 84
Advanced RAG + Hybrid Retrieval + Reranking
        ↓
DAY 85
Evaluation + Observability + Production Quality
        ↓
DAY 86
Production RAG Reliability + Guardrails
```

The goal of Day 85 is therefore:

```text
BUILD
   ↓
MEASURE
   ↓
EVALUATE
   ↓
DEBUG
   ↓
REGRESSION TEST
   ↓
IMPROVE
   ↓
MONITOR
```

That is the production RAG engineering mindset.
