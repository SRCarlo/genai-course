# Day 137 — Simulated Canary Release Report

## Scenario

This report evaluates a simulated GenAI release candidate using the default educational rollout thresholds.

## Case 1 — Healthy candidate

Metrics:
- Sample size: 500 requests
- Error rate: 1%
- p95 latency: 900 ms
- Cost increase: 10%
- Quality drop: 2%

Decision: PROMOTE

Evidence:
- Sample size meets the minimum requirement of 100.
- Error rate is below the 2% limit.
- p95 latency is below the 1,200 ms limit.
- Cost increase is below the 20% limit.
- Quality drop is below the 5% limit.

Reason:
All configured guardrails pass and there are enough samples.

## Case 2 — Cost guardrail breached

Metrics:
- Sample size: 500 requests
- Error rate: 1%
- p95 latency: 900 ms
- Cost increase: 35%
- Quality drop: 2%

Decision: ROLLBACK

Evidence:
- Cost increase exceeds the configured 20% limit.
- Other listed metrics remain within their configured limits.

Reason:
A measured guardrail breach takes priority over otherwise healthy metrics.

## Recommended action for a real deployment

For Case 1, a deployment controller could increase candidate traffic gradually after confirming trusted monitoring evidence and any required human approval.

For Case 2, stop increasing candidate traffic and route traffic back to the last known-good release using the authorized deployment platform. Verify service health and preserve monitoring evidence.

## Limitations

These are simulated metrics, not live production measurements. The decision engine evaluates a policy; it does not shift traffic or execute a rollback.
