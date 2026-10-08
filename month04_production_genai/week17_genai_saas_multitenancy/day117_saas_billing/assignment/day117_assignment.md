# Day 117 Assignment

## Part 1 — Plans

Create Free, Starter and Pro plans with:

- monthly price
- max users
- monthly tokens
- monthly requests
- features

## Part 2 — Subscription

Implement:

- createSubscription()
- getSubscription()
- upgradeSubscription()
- downgradeSubscription()
- cancelSubscription()

## Part 3 — Entitlements

Implement:

- getEntitlements()
- canUseFeature()
- getLimit()

## Part 4 — Usage Billing

Connect usage records to billing and calculate:

- included usage
- overage
- usage charge

## Part 5 — Invoice

Implement:

- createInvoice()
- addInvoiceItem()
- calculateInvoiceTotal()
- finalizeInvoice()

## Part 6 — Payment

Implement:

- createPayment()
- getPayment()
- refundPayment()

## Part 7 — Idempotency

Implement payment and webhook idempotency.

## Part 8 — Webhooks

Handle:

- subscription.updated
- invoice.paid
- payment.failed
- subscription.cancelled

## Part 9 — Usage endpoint

GET /v1/billing/usage

## Part 10 — Invoice endpoint

GET /v1/billing/invoices

## Advanced scenario

Tenant ACME, Pro plan, $49 base price, 10M included tokens, 8M input + 5M output = 13M total usage.

Overage = 3M.

At $4/M:

Overage = $12.

Invoice:

- Pro subscription = $49
- AI token overage = $12
- Total = $61

Then simulate payment → payment succeeded → invoice paid → webhook → subscription remains active.
