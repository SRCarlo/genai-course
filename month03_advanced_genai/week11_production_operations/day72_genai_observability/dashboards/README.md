# Day 72 — GenAI Observability Dashboard

## API Health

Track:

- Requests/minute
- Successful requests
- Failed requests
- Error rate
- p50 latency
- p95 latency
- p99 latency

## AI Health

Track:

- AI requests
- AI failures
- AI error rate
- AI p50 latency
- AI p95 latency
- AI p99 latency

## Token Usage

Track:

- Input tokens
- Output tokens
- Total tokens

## Cost

Track:

- Cost today
- Cost per hour
- Cost per tenant
- Cost per model
- Cost per endpoint

## Model Health

For every model:

- Requests
- Errors
- Error rate
- p50
- p95
- p99
- Input tokens
- Output tokens
- Cost

Current model:

openai/gpt-oss-20b

## Tenant Health

For every tenant:

- Requests
- Tokens
- Cost
- Quota percentage
- Error rate

## RAG

Track:

- Retrieval requests
- Retrieval failures
- Retrieval latency
- Documents retrieved
- Average documents retrieved

## Agents

Track:

- Agent runs
- Agent iterations
- Tool calls
- Tool failures
- Average iterations per run

## Example Dashboard

========================================

GENAI HEALTH

Requests: 420/min
Error Rate: 1.4%

p50: 650ms
p95: 2.1s
p99: 5.8s

AI Cost Today: $24.80
Tokens Today: 4.2M

========================================

MODEL

openai/gpt-oss-20b

Requests: 10,000
Error Rate: 1.1%
p95: 1.2s
Input Tokens: 12M
Output Tokens: 4M
Cost: $1.80

========================================
