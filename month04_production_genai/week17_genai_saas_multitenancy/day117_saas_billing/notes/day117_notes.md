# Day 117 — GenAI SaaS Billing Notes

## Mental model

Tenant → Customer → Subscription → Plan → Entitlements → Usage → Pricing → Invoice → Payment → Webhook → Reconciliation

## Pricing

GenAI SaaS can use:

- flat subscription
- per-seat pricing
- usage-based pricing
- hybrid pricing

Hybrid pricing is especially useful:

Base subscription + included usage + overage

## Money

Use integer minor units for normal fixed monetary amounts.

Example:

$49.99 → 4999 cents

Always apply currency-specific rules in production.

## Idempotency

Payment retries and webhook retries must not create duplicate logical operations.

## Webhooks

1. verify signature
2. validate event
3. check event ID
4. process once
5. update state
6. acknowledge quickly

## Security

Never trust the client for:

- plan
- price
- usage
- invoice total
- payment status

The server calculates and validates billing values.

## Reconciliation

Provider state must periodically be compared with internal state because webhook delivery can be delayed or fail.

## Groq

If an AI call is needed in this project, use the official `groq-sdk` package and the model:

`openai/gpt-oss-20b`

The billing domain itself does not require an LLM call.
