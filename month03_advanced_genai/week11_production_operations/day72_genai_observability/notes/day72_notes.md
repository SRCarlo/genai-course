# DAY 72 — GENAI OBSERVABILITY

## Three Pillars

Logs
Metrics
Traces

---

## Request ID

Every request gets a unique request ID.

Example:

req_123

Use it to connect:

- HTTP request
- logs
- errors
- AI calls
- usage
- traces

---

## Correlation ID

Connects related operations across:

- API
- queues
- workers
- background jobs
- tool calls

---

## Structured Logging

Prefer:

{
"level": "error",
"message": "LLM request failed",
"requestId": "req_123",
"model": "openai/gpt-oss-20b"
}

over:

something went wrong

---

## Log Levels

DEBUG
INFO
WARN
ERROR
FATAL

---

## Security

Never blindly log:

- API keys
- authorization headers
- passwords
- access tokens
- refresh tokens
- sensitive prompts
- private documents
- sensitive tool arguments

Use:

- redaction
- sampling
- retention policies
- access controls

---

## Metrics

Track:

- requests
- failures
- success rate
- latency
- p50
- p95
- p99

---

## AI Metrics

Track:

- AI requests
- AI failures
- model
- latency
- input tokens
- output tokens
- total tokens
- cost

---

## RAG Metrics

Track:

- embedding latency
- vector search latency
- documents retrieved
- retrieval failure
- context size
- total retrieval latency

---

## Agent Metrics

Track:

- agentRunId
- iterations
- tool calls
- tool duration
- tool errors
- total iterations

---

## Health

Liveness:

Is the process alive?

Readiness:

Can the application serve traffic?

---

## Tracing

A trace represents a complete request.

Example:

API
|
|-- RAG
| |
| |-- Embedding
| |
| |-- Vector DB
|
|-- LLM

---

## OpenTelemetry

Use OpenTelemetry as the standard observability layer.

It can provide:

- traces
- metrics
- instrumentation

---

## Groq

Provider:

Groq

Model:

openai/gpt-oss-20b

SDK:

groq-sdk

---

## Cost

Input:

$0.075 / 1M tokens

Output:

$0.30 / 1M tokens

Formula:

inputCost =
inputTokens / 1,000,000

- inputPrice

outputCost =
outputTokens / 1,000,000

- outputPrice

totalCost =
inputCost + outputCost

---

## Production Debugging

Alert
↓
Request ID
↓
Correlation ID
↓
Logs
↓
Metrics
↓
Trace
↓
Model
↓
Tenant
↓
Tokens
↓
Cost
↓
Root Cause
↓
Fix

---

## Core Lesson

If you cannot observe it,
you cannot reliably operate it.

For GenAI:

Observe:

- model
- tokens
- latency
- cost
- retrieval
- tools
- agent iterations
- errors
- request IDs
- traces
