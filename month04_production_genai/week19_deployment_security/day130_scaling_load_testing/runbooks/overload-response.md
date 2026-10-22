# GenAI API — Overload Response Runbook

## Symptoms

- Increasing p95 or p99 latency
- Rising HTTP 429, 502, or 503 responses
- LLM provider rate-limit errors or timeouts
- Database connection pool exhaustion
- Growing queue depth or memory usage
- Unexpected token usage or cost spikes

## Immediate Response

1. Check dashboards, request IDs, recent deployments, and provider status.
2. Identify whether the bottleneck is the API, database, vector store, queue, or LLM provider.
3. Roll back a problematic release when evidence supports it.
4. Apply bounded concurrency and rate limits.
5. Reject excess work predictably instead of allowing unbounded queues.
6. Reduce nonessential background work where safe.
7. Notify the incident owner and record the timeline.

## GenAI-Specific Actions

- Check provider quotas and token throughput.
- Apply input and output token limits.
- Avoid uncontrolled retries.
- Consider approved fallback behavior, such as cached responses.
- Monitor tenant usage and spending.
- Never bypass tenant authorization to restore throughput.

## Recovery

1. Verify health and readiness.
2. Confirm error rates and latency return to acceptable levels.
3. Run critical API smoke tests.
4. Check answer-quality and retrieval evaluations.
5. Monitor usage and cost after recovery.
6. Record root cause and preventive actions.

## Prevention

- Perform controlled load and soak tests.
- Use bounded queues and request timeouts.
- Establish per-user and per-tenant quotas.
- Review database pool sizes and provider limits.
- Alert on latency, error rates, queue depth, and spending.
- Test overload behavior in staging.
