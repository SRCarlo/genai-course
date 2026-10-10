# Day 119 — Tenant Entitlements and Subscription Lifecycle

## Core mental model
Authentication → Tenant Membership → Subscription State → Entitlements → Quota Enforcement → GenAI Service

## Definitions
- Tenant: customer organization or workspace.
- Membership: relationship between a user and a tenant.
- Plan: reusable product configuration.
- Subscription: a tenant's current or historical plan agreement.
- Entitlement: permission to use a feature or resource.
- Quota: maximum allowed usage over a defined period.
- Usage reservation: temporary allocation of quota before expensive work begins.
- Reconciliation: comparing reserved usage with provider-reported usage.

## Subscription policy in this project
- `active`: allow features until the billing period expires.
- `trialing`: allow features until the billing period expires.
- `past_due`: deny features in this strict teaching example.
- `cancelled`: deny features in this strict teaching example.
- `expired`: deny features.
- `suspended`: deny features.
- `cancelAtPeriodEnd: true`: access continues until `currentPeriodEnd`, provided status remains `active` or `trialing`.

A real product must define grace periods and the billing provider's event transitions explicitly.

## Engineering rules
1. Never trust a client-provided tenant ID as authorization.
2. Enforce membership and resource authorization on the server.
3. Apply tenant filters inside database and vector-store queries.
4. Define access behavior for every subscription state.
5. Enforce feature entitlements before invoking expensive AI services.
6. Reserve quota before calling the provider and reconcile actual usage afterward.
7. Record usage against the correct tenant and billing period.
8. Scope caches, conversations, and agent memory by tenant.
9. Test cross-tenant access explicitly.
10. Use durable repositories and database transactions in production.

## Groq integration
The provider adapter uses `groq-sdk`, reads `GROQ_API_KEY` from the server environment, and defaults to `openai/gpt-oss-20b`. Tests use a fake model adapter and do not require an API key.

## Prototype limitations
This learning project uses in-memory storage and spoofable demo headers. It is not production-ready. In-memory state disappears on restart and is not shared across server instances. The reservation logic is only single-process. Production requires verified authentication, durable persistence, atomic quota enforcement, tenant-scoped data access, and comprehensive authorization tests.
