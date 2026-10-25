# Day 133 — GenAI Usage Analytics and FinOps

## Goal

Build usage analytics, tenant-level cost reporting, budget alerts and FinOps monitoring.

## Core Metrics

- Provider cost
- Input and output tokens
- Request count and success rate
- Cache-hit rate
- Cost by tenant and model
- Budget utilization
- Estimated versus actual cost

## Files

- `src/analytics/usage-analytics.js`
- `src/analytics/budget-alerts.js`
- `tests/analytics.test.js`
- `examples/usage-events.json`

## Run Tests

```bash
node --test
```

Current result: 8 tests passed.

## Analytics Principles

1. Use durable usage records as the accounting source of truth.
2. Define metrics and denominators precisely.
3. Aggregate by tenant, model, time period and status.
4. Deduplicate usage events.
5. Use database aggregation for large datasets.
6. Distinguish provider cost from customer-billable charges.
7. Reconcile estimated costs with provider-reported usage.

## Budget Alerts

Example thresholds:

- 50%: informational dashboard status
- 80%: warning
- 100%: critical alert and apply configured budget policy

Production alerting also needs deduplication, state transitions, notification delivery, retries and recovery alerts.

## Security

- Authenticate and authorize every analytics request.
- Derive tenant scope from trusted server-side identity.
- Restrict platform-wide reporting to authorized administrators.
- Do not expose prompts, generated answers or secrets in financial reports.
- Apply appropriate retention and deletion policies.

## FinOps

FinOps combines financial accountability with engineering optimization.

Useful strategies:

- Cache repeated eligible requests.
- Limit input and output tokens.
- Choose models based on quality and total cost.
- Monitor spending by tenant and feature.
- Forecast end-of-period costs.
- Reconcile usage with provider records.
- Preserve answer quality while optimizing spend.

## Assignment

- Implement usage aggregation and budget alerts.
- Run all eight tests.
- Add tests for invalid data, empty datasets and unknown tenants.
- Design an authenticated analytics API.
- Document alert deduplication and provider reconciliation.
- Add daily usage aggregation.

## Interview Revision

1. FinOps and cost attribution.
2. Usage metering versus billing.
3. Cache-hit rate calculation.
4. Durable usage ledgers.
5. Alert deduplication.
6. Tenant isolation in analytics.
7. Estimated versus actual cost.
8. Cost reconciliation.

## Production Reminder

A reporting function is not a complete alerting or billing system. Durable storage, tenant authorization, reconciliation and reliable notification delivery are separate production requirements.
