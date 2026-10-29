# Day 137 — GenAI Production Rollout and Canary Monitoring

## Learning objectives

- Understand rolling, blue-green, and canary deployment strategies.
- Evaluate candidate releases using reliability, latency, cost, and AI quality.
- Implement a testable rollout policy in Node.js.
- Understand promotion, hold, and rollback decisions.

## Core concepts

- Canary release: expose a small traffic share to a new version before wider rollout.
- Error rate: failed requests divided by measured requests.
- p95 latency: the 95th-percentile request latency.
- Minimum sample size: a requirement intended to reduce decisions based on insufficient evidence.
- Guardrail: a defined threshold or condition that restricts rollout.
- Rollback: restore traffic to a known-good version when a release violates a safety condition.

## Default educational thresholds

- Minimum samples: 100
- Maximum error rate: 2%
- Maximum p95 latency: 1,200 ms
- Maximum cost increase: 20%
- Maximum quality drop: 5%

These are examples. Real limits must be based on service objectives, baselines, and risk.

## Rollout decisions

- PROMOTE: required metrics pass and enough samples are available.
- HOLD: evidence is missing, invalid, or insufficient.
- ROLLBACK: a measured guardrail is breached.

## GenAI monitoring

- Request errors and provider timeouts
- p95 latency
- Input/output tokens and provider cost
- Model evaluation scores and groundedness
- Retrieval quality and citation validity
- Tenant isolation and authorization
- Cache behavior and quota enforcement

## Commands

Run from the Day 137 folder:

`node --test tests/rollout-decision.test.js`

## Assignment

Implement and test the rollout decision engine, complete the canary runbook, and document a simulated promotion and rollback.

## Production limitations

The example is not connected to live telemetry or deployment infrastructure. Production needs trusted metrics, a deployment controller, authorized actions, durable audit history, adequate sample sizes, and verified rollback behavior.

## Interview revision

1. Explain canary vs. blue-green deployment.
2. Why monitor p95 latency?
3. What can a minimum sample size tell us?
4. Why include token cost and AI quality in release guardrails?
5. Why is a policy decision engine alone insufficient for production rollout?
