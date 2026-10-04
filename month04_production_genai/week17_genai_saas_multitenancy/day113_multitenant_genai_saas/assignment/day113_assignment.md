# Day 113 Assignment

## Part 1 — Tenants

Implement:

- tenant-acme
- tenant-beta
- tenant-enterprise

## Part 2 — API keys

Demonstrate:

- valid key -> accepted
- invalid key -> rejected
- revoked key -> rejected

## Part 3 — Tenant resolution

Every authenticated request resolves:

- userId
- tenantId

## Part 4 — Plans

Implement:

- FREE
- PRO
- ENTERPRISE

with different request, token and model limits.

## Part 5 — Model access

Test:

- Free -> fast
- Pro -> fast + balanced
- Enterprise -> fast + balanced + quality

## Part 6 — Rate limits

Prove one tenant being rate-limited does not rate-limit another tenant.

## Part 7 — Token budgets

Record usage and reject requests after the tenant budget is exhausted.

## Part 8 — Tenant RAG

Create tenant-specific documents and prove cross-tenant retrieval is blocked.

## Part 9 — Tenant cache

Prove identical prompts from two tenants use different cache keys.

## Part 10 — Usage metering

Record tenant, user, model, input tokens, output tokens, total tokens and timestamp.

## Advanced

Build tenant admin endpoints for tenant details, usage, cost and API key metadata.
