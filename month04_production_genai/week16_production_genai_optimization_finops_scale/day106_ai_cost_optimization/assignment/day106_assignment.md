# Day 106 Assignment

## Task 1 — Build Cost Calculator

Implement:

- input tokens
- output tokens
- input price
- output price
- total cost

File:

`src/cost/cost-calculator.js`

---

## Task 2 — Build Cost Event Tracking

Track:

- requestId
- tenantId
- userId
- application
- feature
- workflow
- model
- inputTokens
- outputTokens
- cost
- timestamp

File:

`src/cost/cost-event.js`

---

## Task 3 — Model Comparison

Compare:

- small model
- medium model
- large model

Measure:

- quality
- latency
- cost

File:

`evaluation/cost/model-comparison.json`

Use real benchmark measurements for your final project.

---

## Task 4 — Model Router

Starter rule:

- simple request → small
- medium request → medium
- complex request → large

File:

`src/cost/model-router.js`

For the live Groq demo, use:

`openai/gpt-oss-20b`

---

## Task 5 — Embedding Cache

Test:

- new document → embed
- same document → cache hit
- modified document → embed again

File:

`src/cost/embedding-cache.js`

---

## Task 6 — Cost Budget

Implement:

- daily budget
- monthly budget
- tenant budget

When exceeded:

- block, or
- degrade safely

File:

`src/cost/cost-guard.js`

---

## Task 7 — Retry Cost

Simulate:

- 0 retries
- 1 retry
- 2 retries
- 3 retries

Calculate additional cost.

Files:

- `src/cost/cost-calculator.js`
- `src/cost/retry-budget.js`

---

## Task 8 — Context Optimization

Create a test with:

- 10 retrieved chunks

Then reduce to:

- 3 relevant chunks

Compare:

- tokens
- cost
- latency
- answer quality

---

## Task 9 — Semantic Cache Simulation

Create at least:

- 20 similar queries

Measure:

- cache hits
- cache misses
- estimated cost saved

Respect tenant/user authorization.

---

## Task 10 — Complete Optimization Experiment

Compare:

### Before

- large model
- large context
- no cache
- retries

### After

- model routing
- optimized context
- cache
- controlled retries

Record:

- cost reduction
- quality difference
- latency difference
- security considerations

File:

`evaluation/cost/optimization-results.json`
