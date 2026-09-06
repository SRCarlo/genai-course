# DAY 85 — RAG Evaluation, Observability & Production Quality Engineering

## Week 13 — Advanced → Production

Day 85 focuses on moving from:

> "I built a RAG system."

to:

> "I can measure, debug, evaluate, monitor, and improve my RAG system."

The goal is to make the RAG system measurable and production-oriented.

---

# 1. Day 85 Objectives

By the end of Day 85, I should understand and implement:

- RAG evaluation
- Retrieval evaluation
- Recall@K
- Precision@K
- MRR
- Context relevance
- Context precision
- Answer faithfulness
- Answer correctness
- Golden datasets
- Regression testing
- Structured logging
- Request IDs
- Request tracing
- Component-level latency
- P50 latency
- P95 latency
- Token usage tracking
- Cost tracking
- Failure classification
- Out-of-domain detection
- Evaluation APIs
- Production monitoring

---

# 2. RAG Production Quality

A RAG application has multiple stages:

```text
User
  ↓
Question
  ↓
Query Processing
  ↓
Embedding
  ↓
Retrieval
  ↓
Reranking
  ↓
Context Construction
  ↓
LLM
  ↓
Answer
```

A successful response does not necessarily mean the system is working correctly.

We need to know:

```text
Did retrieval find the correct document?

Was the correct document ranked highly?

Was irrelevant context included?

Did the answer use the retrieved context?

Did the model hallucinate?

How long did retrieval take?

How long did generation take?

How many tokens were consumed?

How much did the request cost?

Which component failed?
```

These questions are answered by evaluation and observability.

---

# 3. RAG Quality Model

RAG quality can be divided into several dimensions:

```text
                    RAG QUALITY
                         │
          ┌──────────────┼──────────────┐
          ↓              ↓              ↓
      Retrieval       Context       Generation
       Quality         Quality         Quality
          │              │              │
          ↓              ↓              ↓
      Recall@K       Relevance      Faithfulness
      Precision@K    Precision      Correctness
      MRR            Coverage       Grounding
```

There are also system-level metrics:

```text
Latency
Reliability
Token Usage
Cost
Error Rate
Security
```

---

# 4. Retrieval Evaluation

Retrieval evaluation answers:

> Did the retriever find the information required to answer the question?

Suppose the knowledge base contains:

```text
doc1
doc2
doc3
doc4
doc5
```

The correct document is:

```text
doc4
```

The retriever returns:

```text
1. doc2
2. doc4
3. doc1
4. doc5
5. doc3
```

The correct document was retrieved, but it was ranked second.

Retrieval evaluation helps us measure how good this result is.

---

# 5. Recall@K

Recall@K measures how many relevant documents were retrieved within the top K results.

Formula:

```text
Recall@K =
Number of relevant documents retrieved in Top-K
------------------------------------------------
Total number of relevant documents
```

Example:

Relevant documents:

```text
doc4
doc7
```

Top 5 results:

```text
doc2
doc4
doc8
doc10
doc11
```

Only `doc4` was retrieved.

Therefore:

```text
Recall@5 = 1 / 2
         = 0.5
```

Recall is important because the LLM cannot use information that the retriever failed to retrieve.

---

# 6. Precision@K

Precision@K measures how many retrieved documents are relevant.

Formula:

```text
Precision@K =
Relevant documents retrieved in Top-K
--------------------------------------
Total documents retrieved in Top-K
```

Example:

```text
doc1 ❌
doc2 ✅
doc3 ❌
doc4 ✅
doc5 ❌
```

Relevant documents:

```text
2
```

Retrieved documents:

```text
5
```

Therefore:

```text
Precision@5 = 2 / 5
            = 0.4
```

High precision means the retrieved context contains less irrelevant information.

---

# 7. Recall vs Precision

Recall asks:

> Did we find the important information?

Precision asks:

> How much of what we found is actually useful?

A common RAG architecture is:

```text
Retriever
    ↓
High Recall
    ↓
Reranker
    ↓
High Precision
    ↓
Context Builder
    ↓
LLM
```

The initial retriever can retrieve more candidates.

The reranker can then select the most relevant results.

---

# 8. MRR

MRR means:

> Mean Reciprocal Rank

It evaluates how highly the first relevant result appears.

If the first relevant document is rank 1:

```text
1 / 1 = 1
```

If it is rank 2:

```text
1 / 2 = 0.5
```

If it is rank 5:

```text
1 / 5 = 0.2
```

For multiple queries:

```text
MRR =
average reciprocal rank of the first relevant result
```

Higher MRR is better.

---

# 9. Why MRR Matters

Consider two systems.

System A:

```text
Correct document → Rank 1
```

System B:

```text
Correct document → Rank 15
```

Both systems retrieved the correct document.

However, System A is much more useful when only the top few documents are passed to the LLM.

MRR captures ranking quality.

---

# 10. Context Relevance

Retrieval quality and context quality are related but different.

Example question:

```text
How do I refresh a JWT?
```

Retrieved context:

```text
JWT is a token format.

JWT contains a header, payload and signature.

OAuth is an authorization framework.

Refresh tokens can be used to obtain a new access token.
```

Some information is directly useful while some is only loosely related.

A good RAG system should provide highly relevant context.

---

# 11. Context Precision

Suppose the retriever returns five chunks:

```text
Chunk 1 → useful
Chunk 2 → irrelevant
Chunk 3 → useful
Chunk 4 → irrelevant
Chunk 5 → irrelevant
```

Only two chunks are useful.

The context pipeline should reduce unnecessary context.

Possible improvements:

```text
Better chunking
       ↓
Better retrieval
       ↓
Hybrid retrieval
       ↓
Reranking
       ↓
Context filtering
```

---

# 12. Faithfulness

Faithfulness asks:

> Is the generated answer supported by the retrieved context?

Context:

```text
HTTP 429 means Too Many Requests.
```

Answer:

```text
HTTP 429 means Too Many Requests.
```

This is faithful.

But:

```text
HTTP 429 means Too Many Requests and the server
always retries after exactly 30 seconds.
```

If the context does not support the second claim, the answer is not fully faithful.

This is a grounding problem.

---

# 13. Answer Correctness

Faithfulness and correctness are different.

An answer can be:

```text
Faithful but incomplete
```

or:

```text
Correct but unsupported by retrieved context
```

A good RAG system should ideally have:

```text
High Retrieval Quality
+
High Context Relevance
+
High Faithfulness
+
High Answer Correctness
```

---

# 14. Golden Evaluation Dataset

Create:

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

This dataset becomes the benchmark for the RAG application.

---

# 15. Why Golden Datasets Matter

Suppose the current system has:

```text
Recall@5 = 0.91
```

We change the chunking strategy.

After the change:

```text
Recall@5 = 0.72
```

The new implementation made retrieval worse.

Without an evaluation dataset, this regression might go unnoticed.

Golden datasets allow repeatable evaluation.

---

# 16. Evaluation Dataset Categories

Do not create only easy questions.

Include categories such as:

```text
Authentication
API errors
Database
Node.js
Express
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

Example:

```text
How does JWT refresh work?
```

```text
Tell me something about authentication.
```

```text
What is the capital of France?
```

The last question may be outside the knowledge base.

---

# 17. Retrieval Evaluation Functions

The evaluation layer should calculate:

```text
Recall@3
Recall@5
Recall@10

Precision@3
Precision@5
Precision@10

MRR
```

Example Recall@K implementation:

```javascript
export function recallAtK(results, relevantDocuments, k) {
  const topResults = results.slice(0, k);

  const retrievedIds = new Set(topResults.map((result) => result.documentId));

  const found = relevantDocuments.filter((id) => retrievedIds.has(id));

  if (relevantDocuments.length === 0) {
    return 0;
  }

  return found.length / relevantDocuments.length;
}
```

---

# 18. Precision@K Implementation

```javascript
export function precisionAtK(results, relevantDocuments, k) {
  const topResults = results.slice(0, k);

  if (topResults.length === 0) {
    return 0;
  }

  const relevant = topResults.filter((result) =>
    relevantDocuments.includes(result.documentId),
  );

  return relevant.length / topResults.length;
}
```

---

# 19. Reciprocal Rank

```javascript
export function reciprocalRank(results, relevantDocuments) {
  const index = results.findIndex((result) =>
    relevantDocuments.includes(result.documentId),
  );

  if (index === -1) {
    return 0;
  }

  return 1 / (index + 1);
}
```

---

# 20. Mean Function

```javascript
export function mean(values) {
  if (!values.length) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
```

MRR:

```javascript
const mrr = mean(evaluationResults.map((item) => item.reciprocalRank));
```

---

# 21. Observability

Observability answers:

> What happened inside the system?

A RAG request can contain:

```text
Request
  ↓
Query Rewrite
  ↓
Embedding
  ↓
Vector Search
  ↓
Keyword Search
  ↓
Hybrid Ranking
  ↓
Reranking
  ↓
Context Building
  ↓
LLM Generation
```

Each step should be observable.

---

# 22. Request IDs

Every RAG request should have a unique request ID.

Example:

```text
req_123
```

The same ID should be included in all logs associated with that request.

Example:

```json
{
  "event": "retrieval_completed",
  "requestId": "req_123",
  "resultCount": 10,
  "latencyMs": 45
}
```

This allows us to trace a complete request.

---

# 23. Request ID Generation

Example:

```javascript
import crypto from "crypto";

export function createRequestId() {
  return crypto.randomUUID();
}
```

---

# 24. Structured Logging

Avoid:

```javascript
console.log("something happened");
```

Prefer structured logs:

```javascript
console.log(
  JSON.stringify({
    event: "retrieval_completed",
    requestId,
    query,
    resultCount: results.length,
    latencyMs,
  }),
);
```

Structured logs can be indexed and searched by observability platforms.

---

# 25. Timer Utility

A timer should measure component-level latency.

Example:

```javascript
export async function measure(name, fn) {
  const start = performance.now();

  const result = await fn();

  const latencyMs = performance.now() - start;

  return {
    result,
    latencyMs,
    operation: name,
  };
}
```

Usage:

```javascript
const search = await measure("vector_search", () => vectorSearch(query));

console.log(search.latencyMs);
```

---

# 26. Component-Level Latency

Measure:

```text
Query rewriting
Embedding
Vector database
Keyword search
Hybrid ranking
Reranking
Context construction
LLM generation
```

Do not only measure total API latency.

If the request takes 2 seconds, we need to know why.

Example:

```text
Query rewrite     100ms
Embedding          80ms
Vector search      50ms
Keyword search     30ms
Reranking         180ms
Context build       5ms
LLM               950ms
------------------------
Total            1395ms
```

The LLM is the largest component.

---

# 27. Token Tracking

LLM calls should track:

```text
Input tokens
Output tokens
Total tokens
```

Example:

```json
{
  "inputTokens": 2500,
  "outputTokens": 450,
  "totalTokens": 2950
}
```

Token tracking helps with:

```text
Cost optimization
Context optimization
Performance analysis
Budget management
```

---

# 28. Groq API

This project uses Groq instead of the OpenAI API.

Model:

```text
openai/gpt-oss-20b
```

The application should keep the model configurable.

Example `.env`:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-20b
```

The Groq SDK should be used for generation.

Do not expose the API key in source code.

---

# 29. Cost Tracking

Cost depends on:

```text
Input tokens
Output tokens
Provider pricing
Model pricing
```

Conceptually:

```text
Input Cost =
input tokens × input token price
```

```text
Output Cost =
output tokens × output token price
```

```text
Total Cost =
Input Cost + Output Cost
```

Prices can change.

Therefore, pricing should be configurable.

---

# 30. Cost Tracker

Example:

```javascript
export function calculateCost({
  inputTokens,
  outputTokens,
  inputPricePerMillion,
  outputPricePerMillion,
}) {
  const inputCost = (inputTokens / 1_000_000) * inputPricePerMillion;

  const outputCost = (outputTokens / 1_000_000) * outputPricePerMillion;

  return inputCost + outputCost;
}
```

The example pricing values should not be treated as current Groq pricing.

---

# 31. RAG Trace

A standard trace can contain:

```javascript
const trace = {
  requestId,
  query,
  rewrittenQuery: null,

  retrieval: {
    vectorResults: [],
    keywordResults: [],
    hybridResults: [],
    rerankedResults: [],
  },

  context: {
    chunks: [],
    tokenCount: 0,
  },

  generation: {
    model: null,
    inputTokens: 0,
    outputTokens: 0,
    latencyMs: 0,
  },

  totalLatencyMs: 0,

  errors: [],
};
```

This trace makes debugging easier.

---

# 32. Production Trace

Example:

```text
requestId: req_001

QUERY
 └── How does JWT refresh work?

REWRITE
 └── JWT refresh token authentication flow

RETRIEVAL
 ├── vector: 10
 ├── keyword: 10
 └── hybrid: 15

RERANKING
 └── top: 5

CONTEXT
 ├── chunks: 3
 └── tokens: 1800

LLM
 ├── model: openai/gpt-oss-20b
 ├── input: 2100 tokens
 ├── output: 300 tokens
 └── latency: 950ms

TOTAL
 └── 1.4 seconds
```

---

# 33. Failure Classification

Different failures require different fixes.

Possible failure types:

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

---

# 34. Retrieval Failure Example

Question:

```text
What is HTTP 429?
```

Expected document:

```text
http-errors.md
```

Retriever returns:

```text
javascript-basics.md
node-routing.md
jwt-guide.md
```

The answer is likely to be incorrect because the required information was not retrieved.

Classification:

```text
retrieval_failure
```

This is different from an LLM generation failure.

---

# 35. Evaluation Runner

The evaluation runner executes every test question against the RAG system.

Conceptually:

```javascript
export async function runEvaluation(dataset, ragSystem) {
  const results = [];

  for (const test of dataset) {
    const output = await ragSystem.query(test.question);

    results.push({
      id: test.id,
      question: test.question,
      retrieved: output.sources,
      expected: test.relevantDocuments,
    });
  }

  return results;
}
```

---

# 36. Evaluation Report

A useful evaluation report might look like:

```text
=================================
RAG EVALUATION REPORT
=================================

Questions: 100

Retrieval
---------
Recall@3:     0.81
Recall@5:     0.91
Recall@10:    0.96

Precision
---------
Precision@3:  0.74
Precision@5:  0.69

Ranking
-------
MRR:          0.87

Latency
-------
P50:          820ms
P95:          1.9s

Generation
----------
Faithfulness: 0.92
Correctness:  0.89
```

These numbers are examples only.

Actual values must come from the evaluation dataset.

---

# 37. P50 Latency

P50 is the median latency.

Approximately:

```text
50% of requests
```

are faster than the P50 value and approximately:

```text
50% of requests
```

are slower.

Example:

```text
P50 = 720ms
```

means the median request latency is approximately 720ms.

---

# 38. P95 Latency

P95 represents the latency threshold below which approximately 95% of requests fall.

Example:

```text
P95 = 1.8 seconds
```

This means most requests complete within approximately 1.8 seconds, while the slowest 5% take longer.

P95 is more informative than average latency for production systems.

---

# 39. P99 Latency

P99 is another useful tail-latency metric.

```text
P50 → typical request
P95 → slower requests
P99 → extreme tail
```

For production monitoring, P50, P95 and P99 are commonly useful.

---

# 40. Out-of-Domain Detection

Suppose the RAG system is designed for:

```text
Node.js documentation
```

The user asks:

```text
What is the population of Japan?
```

The system should not confidently fabricate an answer.

A safer flow is:

```text
Question
   ↓
Retrieval
   ↓
Similarity / relevance check
   ↓
Insufficient context
   ↓
"I don't have enough information."
```

---

# 41. Regression Testing

RAG systems can regress after changes.

Example:

Before:

```text
Recall@5 = 0.91
```

After changing chunking:

```text
Recall@5 = 0.72
```

A regression test should detect this.

Flow:

```text
Code Change
    ↓
Run Tests
    ↓
Run RAG Evaluation
    ↓
Compare Metrics
    ↓
Pass / Fail
```

---

# 42. CI Evaluation

A production CI pipeline can be:

```text
git push
   ↓
CI
   ↓
Unit Tests
   ↓
Integration Tests
   ↓
RAG Evaluation
   ↓
Metric Comparison
   ↓
Pass / Fail
```

Example rule:

```text
Recall@5 must not decrease
more than an agreed threshold.
```

The threshold should be determined by project requirements.

---

# 43. Production Dashboard

A RAG dashboard could track:

```text
Requests
Error Rate
P50 Latency
P95 Latency
P99 Latency
Recall@5
Precision@5
MRR
Average Tokens
Average Cost
Provider Errors
Retrieval Failures
Generation Failures
```

Example:

```text
┌────────────────────────────────────┐
│           RAG SYSTEM               │
├────────────────────────────────────┤
│ Requests            52,340         │
│ Error Rate            0.8%         │
│ P50 Latency          720ms         │
│ P95 Latency          1.8s          │
│ Recall@5             0.91          │
│ MRR                  0.87          │
│ Avg Tokens          2,430          │
│ Avg Cost             configurable  │
└────────────────────────────────────┘
```

---

# 44. Security and Observability

Observability data can contain sensitive information.

Do not casually log:

```text
API keys
Passwords
Authorization headers
Private documents
Sensitive user information
Secrets
```

Use appropriate:

```text
Redaction
Access control
Encryption
Retention policies
```

The observability system itself must be secure.

---

# 45. Day 85 Architecture

The complete architecture:

```text
                         ┌─────────────────┐
                         │ Observability   │
                         │ Logs + Traces   │
                         └────────┬────────┘
                                  │
USER                              │
 ↓                                │
Question                          │
 ↓                                │
Query Rewrite                     │
 ↓                                │
Hybrid Retrieval                  │
 ↓                                │
Reranking                         │
 ↓                                │
Context Builder                   │
 ↓                                │
Groq API                          │
 ↓                                │
openai/gpt-oss-20b                │
 ↓                                │
Answer + Sources                  │
 ↓                                │
Evaluation                        │
 ↓                                │
Metrics                           │
```

---

# 46. Day 85 Project Structure

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

# 47. API Endpoints

RAG query:

```text
POST /api/rag/query
```

Evaluation:

```text
POST /api/evaluation/run
```

Metrics:

```text
GET /api/evaluation/metrics
```

Health:

```text
GET /health
```

Example:

```json
{
  "status": "ok",
  "service": "rag-api"
}
```

---

# 48. Evaluation API Response

Example:

```json
{
  "totalQuestions": 20,
  "retrieval": {
    "recallAt3": 0.85,
    "recallAt5": 0.9,
    "recallAt10": 0.95,
    "precisionAt3": 0.76,
    "precisionAt5": 0.72,
    "mrr": 0.84
  },
  "latency": {
    "p50": 720,
    "p95": 1800
  },
  "errors": {
    "retrieval": 1,
    "generation": 0
  }
}
```

---

# 49. Day 85 Implementation Goals

## Basic

Implement:

```text
Evaluation dataset
Recall@K
Precision@K
MRR
Request ID
Structured logs
Timer
Retrieval latency
LLM latency
Unit tests
Evaluation runner
Evaluation report
```

## Intermediate

Add:

```text
P50
P95
Token tracking
Cost tracking
Failure classification
Context relevance
Source tracking
Out-of-domain detection
Evaluation API
```

## Advanced

Add:

```text
Golden dataset
Automated evaluation
Recall@3
Recall@5
Recall@10
Precision@3
Precision@5
Precision@10
MRR
Context relevance
Faithfulness
Correctness
Request tracing
Structured logs
Latency monitoring
Token monitoring
Cost tracking
Failure classification
Regression detection
Evaluation API
Production dashboard data
```

---

# 50. Interview Questions

## Q1. What is Recall@K?

Recall@K measures the fraction of relevant documents that appear within the top K retrieved results.

---

## Q2. What is Precision@K?

Precision@K measures the fraction of top-K retrieved documents that are relevant.

---

## Q3. What is MRR?

MRR is Mean Reciprocal Rank. It measures how highly the first relevant result appears in ranked retrieval results.

---

## Q4. Why is retrieval evaluation important?

The LLM cannot reliably answer using information that was never retrieved.

Poor retrieval can therefore produce incorrect answers even when the LLM is capable of answering the question.

---

## Q5. What is RAG observability?

RAG observability is the ability to inspect and measure the internal behavior of a RAG request.

This includes:

```text
Query processing
Retrieval
Reranking
Context
LLM generation
Latency
Tokens
Errors
Cost
```

---

## Q6. Why use request IDs?

Request IDs allow logs from multiple components to be correlated with one user request.

---

## Q7. What is P95?

P95 is the latency value below which approximately 95% of observed requests fall.

It is useful for understanding tail latency.

---

## Q8. What is faithfulness?

Faithfulness measures whether generated claims are supported by the retrieved context.

---

## Q9. What is a golden dataset?

A curated evaluation dataset containing representative questions and expected retrieval and/or answer behavior.

---

## Q10. What should happen when retrieval fails?

The system should avoid blindly generating an answer.

Depending on the application, it can:

```text
Ask for clarification
Use another retrieval strategy
Return an uncertainty response
Say that sufficient information is unavailable
```

---

## Q11. Why measure component-level latency?

Total latency only tells us that a request is slow.

Component-level latency tells us where the bottleneck exists.

---

## Q12. What is RAG regression testing?

It is running a fixed evaluation dataset after system changes and comparing the new metrics against a baseline.

---

# 51. Production Mindset

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

Can I prove retrieval quality?

Can I determine why an answer was wrong?
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

# 52. Day 85 Core Principle

> You cannot improve a production RAG system reliably unless you can measure it.

The progression is:

```text
DAY 83
Embeddings
    ↓
DAY 84
Advanced RAG
    ↓
DAY 85
Evaluation + Observability
    ↓
DAY 86
Production RAG Reliability & Guardrails
```

Day 85 moves the project from:

```text
Building RAG
```

to:

```text
Engineering measurable RAG
```

---

# 53. Final Checklist

Before moving to Day 86:

```text
☐ RAG evaluation
☐ Recall@K
☐ Precision@K
☐ MRR
☐ Context relevance
☐ Context precision
☐ Faithfulness
☐ Answer correctness
☐ Golden dataset
☐ Regression testing
☐ Request tracing
☐ Request ID
☐ Structured logging
☐ Latency measurement
☐ P50
☐ P95
☐ P99
☐ Token tracking
☐ Cost tracking
☐ Failure classification
☐ Out-of-domain detection
☐ Production RAG monitoring
☐ Groq API integration
☐ openai/gpt-oss-20b
```

---

# 54. Final Understanding

At the end of Day 85, the RAG system should no longer be treated as a black box.

Instead:

```text
                         RAG SYSTEM
                              │
          ┌───────────────────┼───────────────────┐
          ↓                   ↓                   ↓
      Evaluation         Observability        Production
          │                   │                   │
      Recall@K             Logs                Latency
      Precision@K          Traces              Tokens
      MRR                  Request IDs         Cost
      Faithfulness         Errors              Reliability
      Correctness          Timing              Monitoring
          │                   │                   │
          └───────────────────┼───────────────────┘
                              ↓
                    Measurable RAG System
```

The goal is not simply to generate answers.

The goal is to know:

```text
WHY
the system generated the answer,

HOW
good the retrieval was,

HOW
well the answer was grounded,

HOW
fast the request was,

HOW
much it cost,

and WHAT
failed when something went wrong.
```
