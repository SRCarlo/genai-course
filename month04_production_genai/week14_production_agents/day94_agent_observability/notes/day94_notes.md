# Day 94 — Agent Observability

## 1. Observability
Observability means understanding what happened inside an agent from telemetry.

## 2. Evaluation vs Observability
Evaluation asks how well the agent performs on test cases.
Observability asks what happened during an actual execution.

## 3. Logs
Logs record individual events.

## 4. Structured Logging
Use machine-readable JSON fields such as traceId, requestId, event, latencyMs, and status.

## 5. Log Levels
DEBUG, INFO, WARN, ERROR, FATAL.

## 6. Metrics
Numerical measurements such as request count, success rate, latency, tokens, and cost.

## 7. AI Agent Metrics
Reliability, performance, cost, quality, retries, tool failures, LLM failures.

## 8. Traces
A trace represents one complete request/workflow.

## 9. Spans
A span represents an operation inside a trace.

## 10. Trace IDs
A unique identifier for the complete execution.

## 11. Request IDs
Identify an individual incoming request.

## 12. Correlation IDs
Connect related events across services.

## 13. Instrumentation
Adding telemetry collection to the application.

## 14. Agent Tracing
The agent.execute span covers the workflow.

## 15. LLM Tracing
Each Groq model call is represented by an llm.call span.

## 16. Tool Tracing
The search operation is represented by a tool.search span.

## 17. Multi-Agent Tracing
Extend the same trace to supervisor/research/writer agents.

## 18. Agent Handoffs
Record from-agent and to-agent as span attributes or events.

## 19. Token Monitoring
Track input, output, and total tokens.

## 20. Cost Monitoring
Estimate cost from token usage and configurable model pricing.

## 21. Error Taxonomy
TIMEOUT, RATE_LIMIT, AUTH_ERROR, TOOL_ERROR, LLM_ERROR, VALIDATION_ERROR, PARSING_ERROR, UNKNOWN_ERROR.

## 22. Latency
Measure complete workflow and individual spans.

## 23. Percentiles
Use p50, p95, and p99 to understand tail latency.

## 24. Dashboards
Combine reliability, performance, AI usage, cost, quality, and errors.

## 25. Alerts
Alert on meaningful production thresholds rather than every warning.

## 26. Production Debugging
requestId/correlationId -> traceId -> span -> error -> root cause.

## 27. Evaluation + Observability
Evaluation identifies a failure; observability explains the failure.

## 28. Agent Observability Architecture

User -> Agent -> LLM/Tools -> Trace -> Logs/Metrics/Spans -> Dashboard -> Alerts/Evaluation.

## 29. Production Failure Analysis
Intentionally test a timeout and inspect the failed span.

## 30. Interview Questions
Know the difference between logs, metrics, traces, spans, request IDs, trace IDs, and correlation IDs.
