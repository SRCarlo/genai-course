# DAY 65 — LLM Observability & Tracing

## Main Goal

Monitor, trace, debug, and measure a GenAI application in production.

Day 64 focused on **evaluation** — knowing whether the AI system is good.

Day 65 focuses on **observability** — knowing what the AI system is doing in production.

## What Observability Means

Observability is the ability to understand the internal behavior of an application from its outputs and recorded telemetry.

For GenAI applications, observe:

- Requests
- LLM calls
- Prompts and responses
- Tool calls
- RAG retrieval
- Retrieved sources
- Token usage
- Latency
- Errors
- Cost
- Evaluation scores

## Three Traditional Pillars

1. **Logs** — individual events and structured application information.
2. **Metrics** — numerical measurements such as request count, error rate, latency, and token usage.
3. **Traces** — the complete execution path of a request.

For GenAI, add AI-specific telemetry such as:

- LLM inputs/outputs
- Token usage
- Tool calls
- Retrieval information
- Evaluation results
- Cost

## Request ID

Every request should have a unique request ID.

Example:

```text
req_01JABC123
```

A request ID helps identify which logs belong to a particular request when many users are using the API.

## Trace ID

A single request can create multiple operations:

```text
Request
   ↓
Agent
   ├── LLM
   ├── RAG
   │    └── Vector Search
   └── LLM
```

All operations belong to one trace.

Example:

```text
trace_123
```

## Trace and Span

A **trace** represents the complete execution path of a request.

A **span** represents one operation inside a trace.

Typical spans:

```text
TRACE
│
├── agent.run
├── llm.call
├── rag.search
├── vector.search
└── llm.call
```

A span can contain:

```json
{
  "name": "rag.search",
  "startedAt": 1000,
  "endedAt": 1120,
  "durationMs": 120,
  "status": "success"
}
```

## AI-Specific Telemetry

Traditional API telemetry includes:

- HTTP method
- Route
- Status
- Latency

AI telemetry should additionally track:

- Model
- Input/prompt tokens
- Output/completion tokens
- Total tokens
- Tool calls
- Retrieval count
- Retrieved sources
- Temperature
- Model latency
- Generation latency
- Errors
- Estimated cost

Example:

```json
{
  "model": "your-model",
  "inputTokens": 1200,
  "outputTokens": 300,
  "totalTokens": 1500,
  "estimatedCost": 0.0042
}
```

Keep model pricing configurable rather than hardcoding provider assumptions.

## LLM Call Tracing

Every LLM call should produce a span containing information such as:

```text
LLM CALL
├── model
├── input tokens
├── output tokens
├── latency
├── status
└── error
```

If an LLM call fails, capture the error in the developer trace while returning a safe user-facing error.

## Tool Call Tracing

Day 63 tools such as:

- `knowledge_search`
- `calculator`

should appear in the trace.

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

## RAG Tracing

RAG should have its own spans.

```text
rag.search
   │
   ├── query rewrite
   ├── embedding
   ├── vector search
   ├── reranking
   └── context building
```

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

## Source Tracking

Track useful source metadata:

```json
{
  "source": "refund-policy.txt",
  "score": 0.91
}
```

Prefer recording:

- Source ID
- Document ID
- Chunk ID
- Score

Avoid storing complete confidential documents unnecessarily.

## Structured Logging

Avoid unstructured logs such as:

```js
console.log("something happened");
```

Prefer machine-readable structured logs:

```js
console.log(
  JSON.stringify({
    timestamp: new Date().toISOString(),
    level: "info",
    event: "rag.search",
    traceId,
    query: "refund policy",
    resultCount: 3,
  }),
);
```

A reusable logger can expose:

```js
log("info", "agent.started", {
  traceId,
  question,
});
```

## Security: What Not to Log

Never blindly log:

- API keys
- Authorization headers
- Passwords
- Session secrets
- Sensitive personal information
- Full private documents
- Sensitive prompts

Use:

- Redaction
- Filtering
- Access controls
- Retention policies

User questions can also contain sensitive information, so treat them carefully.

## Metrics

Logs answer:

> What happened?

Traces answer:

> What happened across the request?

Metrics answer:

> How often and how well is it happening?

Useful metrics:

- Request count
- Success count
- Error count
- Latency
- LLM calls
- Tool calls
- RAG calls
- Token usage
- Cost

Example dashboard metrics:

```text
Requests       10,250
Success Rate   98.7%
Error Rate      1.3%
Avg Latency     1.82 sec
P95 Latency     4.20 sec
LLM Calls      18,420
RAG Calls       7,850
Tool Calls      9,420
Tokens          12.4M
```

## Request Middleware

The request lifecycle should be:

```text
Request
   ↓
Create request ID
   ↓
Create trace
   ↓
Start timer
   ↓
Execute application
   ↓
Record latency
   ↓
Finish trace
```

The trace should be attached to the request so the Day 63 agent and its components can use the same trace.

## Day 63 + Day 65

Before:

```js
await runAgent(question);
```

After:

```js
await runAgent(question, {
  trace: req.trace,
});
```

The same trace should flow through:

```text
Agent
 ↓
LLM
 ↓
Tool
 ↓
RAG
```

## Example Final Trace

For:

> According to the bonus policy, what is 10% of 60000?

A useful trace can look like:

```text
TRACE trace_abc
│
├── agent.run
├── llm.call
│   ├── inputTokens: 900
│   └── outputTokens: 120
├── tool.call
│   └── knowledge_search
├── rag.search
│   └── resultCount: 3
├── llm.call
│   ├── inputTokens: 1100
│   └── outputTokens: 100
├── tool.call
│   └── calculator
└── agent.final
```

## Error Tracing

If the vector database fails:

```text
Agent
 ↓
RAG
 ↓
Vector DB
 ↓
ERROR
```

Developer telemetry can contain:

```json
{
  "name": "vector.search",
  "status": "error",
  "attributes": {
    "errorType": "VectorDatabaseError"
  }
}
```

The user should receive a safe message such as:

```json
{
  "error": "Unable to process the request."
}
```

Do not expose sensitive internal errors to users.

## Trace Storage

For learning, traces can be stored in memory using a `Map`.

Conceptually:

```js
const traces = new Map();

export function saveTrace(trace) {
  traces.set(trace.traceId, trace);
}

export function getTrace(traceId) {
  return traces.get(traceId);
}
```

For production, replace the in-memory store with a persistent observability backend.

## Debug Endpoint

For local development:

```text
GET /debug/traces/:traceId
```

Example response:

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

Do not expose unrestricted internal traces publicly. Protect debug endpoints with authentication and authorization or keep them internal.

## Request-Level Summary

At the end of a request, generate a summary such as:

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

## Finding Bottlenecks

Example:

```text
agent.run       2200ms
llm.call         700ms
rag.search      1100ms
vector.search    900ms
calculator        20ms
```

The likely bottleneck is **vector search**, not the calculator.

Observability makes optimization data-driven.

## Detecting Expensive Agent Behavior

An inefficient agent might perform:

```text
Question
 ↓
Agent
 ↓
LLM
 ↓
RAG
 ↓
LLM
 ↓
RAG
 ↓
LLM
 ↓
RAG
 ↓
LLM
 ↓
Final
```

Telemetry can reveal:

```text
LLM calls: 4
RAG calls: 3
Latency: 9.2 sec
```

Investigate:

- Better prompting
- Better retrieval
- Better planning
- Fewer iterations

## Day 64 + Day 65

Day 64:

```text
Evaluation
   ↓
Quality
```

Day 65:

```text
Observability
   ↓
Runtime behavior
```

Together:

```text
AI SYSTEM
   │
   ├── OBSERVABILITY → Runtime Data
   │
   └── EVALUATION    → Quality Data
                │
                ↓
          AI QUALITY
                ↓
          IMPROVEMENT
```

Evaluation tells us whether the AI system is good.

Observability tells us what the AI system is doing.

Together they form a production AI quality system.

## Production Investigation Example

User reports:

> The answer was wrong.

Investigation:

1. Find the `traceId`.
2. Inspect the trace.
3. Check the retrieved source.
4. Check Day 64 evaluation results.
5. Identify whether retrieval, prompting, generation, or tools caused the failure.
6. Improve the relevant component.
7. Run evaluation again.

For a retrieval problem, investigate:

- Chunking
- Embeddings
- `topK`
- Reranking
- Query rewriting

## Production Observability Checklist

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

## Key Interview Questions

### 1. What is observability?

Observability is the ability to understand the internal behavior of an application from its telemetry, including logs, metrics, and traces.

### 2. What is a trace?

A trace represents the complete execution path of a request through the system.

### 3. What is a span?

A span represents an individual operation within a trace, such as an LLM call, database query, or tool execution.

### 4. Why is tracing especially important for agents?

Agents can make multiple LLM calls and tool calls dynamically. Tracing helps understand the sequence and identify inefficient or incorrect behavior.

### 5. What should you monitor in an LLM application?

Latency, token usage, model calls, errors, tool calls, retrieval quality, costs, and evaluation metrics.

### 6. Why shouldn't you log everything?

Logs can contain secrets or sensitive user and document information. Excessive logging also increases cost and security risk.

### 7. How would you debug a hallucination?

First inspect the trace, especially the retrieved context. Then determine whether the failure came from retrieval, prompt construction, model generation, or tool behavior.

### 8. What is the difference between logs and traces?

Logs are individual events, while traces connect multiple operations into the execution path of a request.

## Final Lesson

> If you cannot trace what your AI system did, you cannot reliably debug, optimize, or operate it in production.

Day 65 moves the project from:

```text
Day 63 → BUILD
Day 64 → MEASURE QUALITY
Day 65 → OBSERVE RUNTIME
```

The next major focus is AI security and prompt-injection defense, followed by production deployment and scaling.
