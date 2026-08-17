# DAY 65 — LLM Observability & Tracing Assignment

## Objective

Add an observability layer to the Day 63 Agentic RAG application so that every AI request can be traced, measured, debugged, and analyzed.

The final system should make the following execution path visible:

```text
USER QUESTION
    ↓
REQUEST
    ↓
AGENT
    ↓
LLM CALL #1
    ↓
TOOL DECISION
    ↓
RAG SEARCH
    ↓
VECTOR SEARCH
    ↓
RETRIEVED DOCUMENTS
    ↓
LLM CALL #2
    ↓
FINAL ANSWER
    ↓
LATENCY
    ↓
TOKENS
    ↓
ERRORS
    ↓
TRACE
```

## Project Location

Continue the Week 10 project:

```text
week10_evaluation_production/
└── day65_observability/
```

## Required Folder Structure

Create:

```text
day65_observability/
│
├── observability/
│   ├── logger.js
│   ├── tracer.js
│   ├── metrics.js
│   ├── requestContext.js
│   └── aiTelemetry.js
│
├── middleware/
│   └── observabilityMiddleware.js
│
├── traces/
│   └── traceStore.js
│
├── logs/
│   └── .gitkeep
│
├── metrics/
│   └── metricsStore.js
│
├── tests/
│   ├── tracer.test.js
│   ├── metrics.test.js
│   └── observability.test.js
│
├── notes/
│   └── day65_notes.md
│
├── assignment/
│   └── day65_assignment.md
│
├── README.md
├── .env
├── .env.example
├── .gitignore
└── package.json
```

## Setup

From `month03_advanced_genai`:

```bash
mkdir week10_evaluation_production
cd week10_evaluation_production

mkdir day65_observability
cd day65_observability

npm init -y
npm install express dotenv
```

## Mandatory Tasks

### Task 1 — Create Request ID

Implement a unique request identifier.

Example:

```text
req_01JABC123
```

Create:

```text
observability/requestContext.js
```

The request ID must be available throughout the request lifecycle.

### Task 2 — Create Trace ID

Every request should create one trace.

Example:

```text
trace_123
```

A trace should contain at least:

- `traceId`
- `startedAt`
- `spans`
- `status`

### Task 3 — Implement Spans

Create:

```text
observability/tracer.js
```

Implement functionality equivalent to:

```text
createTrace()
startSpan()
endSpan()
```

Each span should record:

- Span ID
- Name
- Start time
- End time
- Duration
- Attributes
- Status

### Task 4 — Trace LLM Calls

Every LLM call must create an `llm.call` span.

Track:

- Model
- Input tokens
- Output tokens
- Latency
- Status
- Error information

Adapt token fields to the response format of the LLM provider you use.

### Task 5 — Trace Tool Calls

The Day 63 tools must appear in the trace.

At minimum, trace:

```text
knowledge_search
calculator
```

Example:

```json
{
  "name": "tool.call",
  "attributes": {
    "tool": "knowledge_search",
    "status": "success"
  }
}
```

### Task 6 — Trace RAG

Create a `rag.search` span.

Track useful information such as:

- Query
- `topK`
- Result count
- Retrieval duration
- Vector-search information
- Retrieved source metadata

Example:

```json
{
  "name": "rag.search",
  "attributes": {
    "query": "refund policy",
    "topK": 5,
    "resultCount": 3
  }
}
```

### Task 7 — Track Retrieved Sources

Record safe source metadata.

Prefer:

- Source ID
- Document ID
- Chunk ID
- Score

Do not unnecessarily store complete confidential documents in logs or traces.

### Task 8 — Structured Logging

Create:

```text
observability/logger.js
```

Logs should be machine-readable JSON.

Include fields such as:

- Timestamp
- Level
- Event
- Trace ID
- Request ID
- Relevant event data

Example event:

```text
agent.started
```

Example event:

```text
rag.search
```

### Task 9 — Add Security Redaction

Do not blindly log:

- API keys
- Authorization headers
- Passwords
- Session secrets
- Sensitive personal information
- Full private documents
- Sensitive prompts

Implement or document a strategy for:

- Redaction
- Filtering
- Access control
- Retention

### Task 10 — Implement Metrics

Track at least:

```text
request_count
success_count
error_count
latency
llm_calls
tool_calls
rag_calls
tokens
```

Create:

```text
metrics/metricsStore.js
```

The learning implementation may use an in-memory object.

Production systems should eventually use a proper metrics backend.

### Task 11 — Request Observability Middleware

Create:

```text
middleware/observabilityMiddleware.js
```

The middleware should:

1. Generate a request ID.
2. Create a trace.
3. Start a timer.
4. Execute the application.
5. Record latency.
6. Set success/error status.
7. Make the trace available to the application.

Expected flow:

```text
Request
 ↓
Request ID
 ↓
Trace
 ↓
Timer
 ↓
Application
 ↓
Latency
 ↓
Trace completion
```

### Task 12 — Connect Day 63 Agent

Modify the Day 63 agent so the same trace is passed through the application.

Concept:

```js
await runAgent(question, {
  trace: req.trace,
});
```

The trace should cover:

```text
Agent
 ↓
LLM
 ↓
Tool
 ↓
RAG
 ↓
Vector Search
 ↓
LLM
 ↓
Final Answer
```

### Task 13 — Error Tracing

Simulate or handle a failure such as a vector database error.

The trace should record:

```json
{
  "name": "vector.search",
  "status": "error",
  "attributes": {
    "errorType": "VectorDatabaseError"
  }
}
```

The user-facing response should remain safe, for example:

```json
{
  "error": "Unable to process the request."
}
```

Do not expose sensitive internal implementation details.

### Task 14 — Trace Storage

Create:

```text
traces/traceStore.js
```

Implement:

```text
saveTrace()
getTrace()
```

An in-memory `Map` is acceptable for this learning project.

Document that production systems should use persistent telemetry storage.

### Task 15 — Debug Trace Endpoint

Create a local-development endpoint:

```text
GET /debug/traces/:traceId
```

It should return the requested trace.

Example:

```json
{
  "traceId": "trace_123",
  "status": "success",
  "latencyMs": 1820,
  "spans": [
    {
      "name": "llm.call",
      "durationMs": 720
    },
    {
      "name": "rag.search",
      "durationMs": 250
    }
  ]
}
```

Protect or disable this endpoint in production.

### Task 16 — Add Cost Information

Attach estimated cost information to relevant telemetry.

Example:

```json
{
  "model": "your-model",
  "inputTokens": 1200,
  "outputTokens": 300,
  "estimatedCost": 0.0042
}
```

Keep pricing configurable.

### Task 17 — Request-Level Summary

Every completed request should be capable of producing a summary containing:

```json
{
  "traceId": "trace_123",
  "status": "success",
  "latencyMs": 1820,
  "llmCalls": 2,
  "toolCalls": 2,
  "ragCalls": 1,
  "inputTokens": 2000,
  "outputTokens": 220
}
```

### Task 18 — Identify Bottlenecks

Create at least one example trace where different operations have different durations.

Example:

```text
agent.run       2200ms
llm.call         700ms
rag.search      1100ms
vector.search    900ms
calculator        20ms
```

Explain which component is the bottleneck and why.

### Task 19 — Connect Day 64 Evaluation

Use Day 64 evaluation results together with Day 65 runtime telemetry.

The goal is to distinguish:

```text
Evaluation → Is the AI good?
Observability → What is the AI doing?
```

Use both to investigate at least one hypothetical or real quality problem.

## Mandatory Tests

### `tests/tracer.test.js`

Test:

- [ ] Trace is created.
- [ ] Trace ID exists.
- [ ] Span is created.
- [ ] Span is completed.
- [ ] Duration is calculated.
- [ ] Errors can be captured.

### `tests/metrics.test.js`

Test:

- [ ] Request count.
- [ ] Error count.
- [ ] LLM count.
- [ ] Tool count.
- [ ] RAG count.
- [ ] Average latency.

### `tests/observability.test.js`

Test:

- [ ] Request ID is generated.
- [ ] Trace is attached to the request.
- [ ] Successful request is recorded.
- [ ] Failed request is recorded.

## Final Trace Requirement

For a request such as:

> According to the bonus policy, what is 10% of 60000?

The resulting trace should approximately contain:

```text
TRACE trace_abc
│
├── agent.run
├── llm.call
│   ├── inputTokens
│   └── outputTokens
├── tool.call
│   └── knowledge_search
├── rag.search
│   └── resultCount
├── llm.call
│   ├── inputTokens
│   └── outputTokens
├── tool.call
│   └── calculator
└── agent.final
```

## Advanced Tasks

Complete these after all mandatory tasks:

- [ ] Add cost tracking.
- [ ] Add P95 latency.
- [ ] Add trace sampling.
- [ ] Add log redaction.
- [ ] Add persistent telemetry.
- [ ] Add dashboards.
- [ ] Add alerts.
- [ ] Integrate an OpenTelemetry-compatible stack.

## Production Readiness Checklist

- [ ] Request ID
- [ ] Trace ID
- [ ] Structured logs
- [ ] LLM tracing
- [ ] Tool tracing
- [ ] RAG tracing
- [ ] Error tracking
- [ ] Latency tracking
- [ ] Token tracking
- [ ] Cost tracking
- [ ] Evaluation metrics
- [ ] Sensitive-data redaction
- [ ] Log retention policy
- [ ] Access-controlled traces
- [ ] Alerts

## Expected Final API Summary

The Agentic RAG endpoint:

```text
POST /api/agentic-rag
```

should be capable of producing a summary similar to:

```json
{
  "traceId": "trace_abc123",
  "latencyMs": 1840,
  "llmCalls": 2,
  "toolCalls": 1,
  "ragCalls": 1,
  "inputTokens": 920,
  "outputTokens": 210,
  "status": "success"
}
```

## Deliverables

Before considering Day 65 complete, verify that the repository contains:

```text
day65_observability/
├── observability/
├── middleware/
├── traces/
├── logs/
├── metrics/
├── tests/
├── notes/
│   └── day65_notes.md
├── assignment/
│   └── day65_assignment.md
├── README.md
├── .env
├── .env.example
├── .gitignore
└── package.json
```

Also verify that Day 63 and Day 64 integrations are documented.

## Suggested Git Commits

### Initialize

```bash
git add week10_evaluation_production/day65_observability
git commit -m "chore(day65): initialize observability workspace"
```

### Tracing and Telemetry

```bash
git add week10_evaluation_production/day65_observability/observability
git commit -m "feat(day65): add ai tracing and telemetry"
```

### Middleware

```bash
git add week10_evaluation_production/day65_observability/middleware
git commit -m "feat(day65): add request observability middleware"
```

### Metrics

```bash
git add week10_evaluation_production/day65_observability/metrics
git commit -m "feat(day65): add ai runtime metrics"
```

### Tests

```bash
git add week10_evaluation_production/day65_observability/tests
git commit -m "test(day65): add observability tests"
```

### Documentation

```bash
git add week10_evaluation_production/day65_observability
git commit -m "docs(day65): document ai observability"
```

Then verify:

```bash
git status
git push origin master
```

## Day 65 Success Criteria

Day 65 is complete when you can answer:

> What did my AI system do during this request?

You should be able to identify:

- Which request was executed.
- Which trace belongs to it.
- Which LLM calls happened.
- Which tools were called.
- Which RAG searches happened.
- Which sources were retrieved.
- How many tokens were used.
- How long each operation took.
- Where errors occurred.
- What the request cost approximately.
- Where the main bottleneck is.
- How runtime behavior relates to Day 64 evaluation quality.

## Key Lesson

> If you cannot trace what your AI system did, you cannot reliably debug, optimize, or operate it in production.
