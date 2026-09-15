# Day 94 Assignment — Agent Observability

## Level 1 — Basic
Instrument the agent and track:
- trace ID
- agent execution
- LLM calls
- tool calls
- latency
- errors

## Level 2 — Intermediate
Add:
- structured logs
- metrics
- token tracking
- cost estimation
- error classification
- trace export

## Level 3 — Advanced
Build:
Agent -> Trace -> Spans -> Logs -> Metrics -> Evaluation -> Dashboard -> Alerts

## Advanced Challenge
Simulate 1,000 agent runs and collect:
- success rate
- failure rate
- p50/p95/p99 latency
- LLM calls
- tool calls
- token usage
- estimated cost
- tool failures
- LLM failures
- evaluation score

Identify the biggest bottleneck.

## Production Failure Exercise
Introduce a search-tool timeout and answer:
1. What failed?
2. Which trace contains the failure?
3. Which span failed?
4. How long did it take?
5. Did the agent retry?
6. Did retry succeed?
7. What was the final result?
8. Did evaluation detect the problem?
