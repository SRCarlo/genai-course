# Day 132 — GenAI Cost Governance

## Goal

Implement token-based cost estimation, tenant budgets, quota enforcement, and usage tracking.

## Key Concepts

- **Token quota:** Limits the number of tokens a tenant can consume.
- **Request quota:** Limits the number of AI requests.
- **Spend budget:** Limits how much a tenant can spend.
- **Budget reservation:** Reserves estimated cost before an AI request.
- **Settlement:** Reconciles reserved cost with actual cost.
- **Usage metering:** Records tokens, model, cost, status, and timestamp.
- **Idempotency:** Prevents duplicate processing from charging usage twice.
- **Tenant isolation:** Ensures each tenant's usage and budget remain separate.

## Cost Formula

Input cost:

(input tokens / 1,000,000) × input price per million tokens

Output cost:

(output tokens / 1,000,000) × output price per million tokens

Total cost = input cost + output cost.

## Files Created

- `src/billing/cost-estimator.js` — estimates input and output costs.
- `src/billing/quota-service.js` — manages budgets and reservations.
- `src/billing/usage-record.js` — creates validated usage records.
- `tests/cost-governance.test.js` — tests cost governance behavior.

## Budget Lifecycle

1. Authenticate the user and identify the tenant.
2. Load the trusted tenant plan and budget.
3. Estimate the expected request cost.
4. Reserve budget before calling the AI provider.
5. Apply request and output-token limits.
6. Call the provider and capture actual usage.
7. Settle the reservation against actual cost.
8. Persist usage records and publish usage metrics.

## Testing

Run the test suite:

```bash
node --test
```

Current result: 8 tests passed.

## Current Limitations

- The quota service uses in-memory Maps. Data is lost when the process restarts.
- Reservations are stored in memory and are not coordinated across multiple server instances.
- Reservation IDs are unique within the service instance, not a durable tenant-aware billing ledger.
- Settlement can record actual cost greater than the reserved amount. Explicit overage policies are needed.
- Monthly quota resets, request-count quotas, invoices, and refunds are not implemented.
- Usage records are created in memory; they are not persisted to a database.

## Production Requirements

- Use a durable database and atomic transactions for budget reservations.
- Make settlement and provider usage processing idempotent.
- Store pricing versions and currency with usage records.
- Define monthly quota periods and reset policies.
- Configure maximum output tokens, request quotas, and concurrency limits.
- Handle provider timeouts and failures with explicit reconciliation policies.
- Add alerts for budget thresholds and unusual usage.
- Enforce tenant isolation on the server, never trust frontend-supplied budgets.
- Avoid logging raw prompts, model responses, API keys, or sensitive documents.

## Connection to Day 131

Caching can reduce provider costs by avoiding repeated model calls. However, provider cost and customer-billable usage may be different. Define whether cache hits count toward request quotas and customer billing.

## Interview Revision

1. Why estimate cost before sending a request?
2. What is the difference between a reservation and settlement?
3. Why should money be represented using integer microdollars?
4. Why are in-memory Maps insufficient for production billing?
5. How does idempotency prevent duplicate charges?
6. Why are atomic transactions needed for concurrent requests?
7. How should provider timeouts be reconciled?
8. Why must tenant budgets be enforced on the backend?

## Assignment

- Add a test for repeated settlement.
- Add a test for actual cost exceeding the reservation.
- Test that one tenant cannot spend another tenant's budget.
- Document monthly quota-reset and provider-timeout policies.
- Design a durable `usage_events` database table.

## Production Reminder

This implementation is a learning foundation, not a production billing ledger.
