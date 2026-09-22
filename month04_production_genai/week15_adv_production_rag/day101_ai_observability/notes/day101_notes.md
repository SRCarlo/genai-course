# Day 101 — AI Observability & Monitoring

## Core Principle

Production AI systems must be observable.

## Three Pillars

- Logs
- Metrics
- Traces

## Important AI Metrics

### System

- request count
- error rate
- P50/P95/P99 latency

### Retrieval

- Recall@K
- Precision@K
- retrieval latency
- reranking latency

### Generation

- faithfulness
- answer relevance
- output validation failures

### LLM

- input tokens
- output tokens
- total tokens
- latency
- estimated cost

## SLI

Actual measurement.

## SLO

Target for an SLI.

## SLA

Formal service commitment.

## Request IDs

Every production AI request should have a unique request ID.

## Drift

Monitor query distribution, query length, retrieval scores, document distribution and quality metrics.

## Alerts

High error rate, high latency, retrieval degradation, faithfulness degradation, cost spikes and token spikes.

## Incident Workflow

Alert → Identify affected period → Inspect request IDs → Inspect traces → Classify failure → Find root cause → Fix → Evaluate → Deploy → Monitor.
