# Day 116 — Usage Metering, Quotas & Rate Limiting

## Mental model

Rate limit = speed

Quota = allowance

Metering = measurement

## Usage event

A usage event records what the customer actually consumed:

- request ID
- tenant ID
- user ID
- API key ID
- operation
- model
- input tokens
- output tokens
- total tokens
- latency
- cost
- timestamp

## Pre-request

Before calling the model:

1. Authenticate.
2. Resolve tenant.
3. Apply rate limits.
4. Estimate request tokens.
5. Check projected quota.

## Post-request

After the provider responds:

1. Read trusted usage metadata.
2. Calculate cost.
3. Record usage.
4. Return usage information.

## Rate limiting

Fixed window is simple.

Sliding window tracks the moving time window more accurately.

Token bucket is useful when controlled bursts are required.

Distributed production systems should use shared state such as Redis rather than a process-local Map.

## Quota race condition

Two concurrent requests can both observe remaining capacity.

Production systems can solve this with:

- atomic database operations
- Redis atomic counters
- transactions
- quota reservations
- distributed coordination

## Trusted usage

Never use client-provided token counts for billing.

Use trusted provider response metadata.

## Day 116 flow

Authentication
→ Tenant
→ RBAC/API scope
→ Rate limit
→ Quota
→ AI provider
→ Actual usage
→ Cost
→ Metering
→ Analytics
→ Billing
