# Incident Runbook

## Provider outage

Check `/health` and `/circuits`; the primary provider is retried and the fallback route is attempted.

## High latency

Check request timeout, retries, cache hit rate, and provider latency.

## High cost

Check token usage, model routing, prompt size, and cache hit rate.

## Low quality

Check prompt construction, retrieval/context if added later, model selection, and evaluation results.
