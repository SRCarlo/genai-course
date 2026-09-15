# Agent Dashboard

## Reliability
- Requests
- Success Rate
- Failure Rate
- Timeout Rate

## Performance
- p50 Latency
- p95 Latency
- p99 Latency
- LLM Latency
- Tool Latency

## AI Usage
- LLM Calls
- Tool Calls
- Input Tokens
- Output Tokens
- Total Tokens

## Cost
- Total Cost
- Cost / Request
- Cost / Agent Workflow

## Quality
- Evaluation Score
- Groundedness
- Tool Accuracy

## Errors
- LLM Errors
- Tool Errors
- Validation Errors
- Rate Limits
- Timeouts

## Suggested alerts

```text
IF error_rate > 5%
    -> WARNING / CRITICAL alert

IF p95_latency > 8000 ms
    -> WARNING alert

IF rate_limit errors increase sharply
    -> CRITICAL alert

IF safety/evaluation score drops below threshold
    -> CRITICAL alert
```

## Trace investigation

Start with requestId/correlationId -> traceId -> spans -> failed span -> root cause.
