# Day 119 Assignment — Tenant Entitlements and Subscription Lifecycle

## Task 1 — Plan entitlements
- Define Free, Starter, and Pro plans.
- Include feature permissions and usage limits.
- Ensure feature permissions are enforced on the backend.

## Task 2 — Tenant access
- Implement a membership repository/service.
- Verify user-to-tenant membership before returning protected resources.
- Test that a user cannot access another tenant's data.

## Task 3 — Subscription lifecycle
Support `trialing`, `active`, `past_due`, `cancelled`, `expired`, and `suspended`.
Document access policy for each state, including grace periods and cancellation at period end.

## Task 4 — Usage enforcement
- Track tokens and requests per tenant and billing period.
- Reject requests that exceed quota.
- Reserve capacity before calling the model.
- Reconcile reserved usage with actual provider usage.
- In production, make reservations atomic across server instances.

## Task 5 — GenAI integration
- Check entitlements before calling Groq.
- Use `openai/gpt-oss-20b`.
- Pass verified tenant context into RAG retrieval.
- Prevent cross-tenant conversation and document access.
- Record usage against the correct tenant.

## Task 6 — Testing
Test Pro access to advanced RAG, Starter denial of agent access, expired subscriptions, unauthorized tenant access, usage limits, concurrent quota reservations, upgrades/downgrades, and cancellation at period end.

## Acceptance criteria
1. Protected endpoints enforce tenant membership.
2. Plan features are evaluated server-side.
3. Subscription state controls entitlement access.
4. Usage records are tenant-scoped.
5. Tests show cross-tenant access is rejected.
6. README and notes explain prototype limitations.
