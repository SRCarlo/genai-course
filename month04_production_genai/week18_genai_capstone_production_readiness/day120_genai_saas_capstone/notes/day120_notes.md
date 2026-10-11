# Day 120 — GenAI SaaS Capstone & Production Readiness

## Objective

Bring the four-month GenAI roadmap together in a modular, testable, production-minded SaaS application.

## Core architecture

Frontend → API → Authentication → Tenant Authorization → Entitlements → Usage Limits → RAG → LLM → Output Validation → Usage Recording → Response

## Core engineering principles

1. Separate application logic from infrastructure and provider-specific implementations.
2. Authenticate users and authorize tenant access before protected operations.
3. Enforce tenant filters inside data-access and retrieval layers.
4. Ground answers in relevant sources and handle unsupported questions.
5. Track input tokens, output tokens, latency, failures, and estimated cost.
6. Enforce quotas atomically when requests may execute concurrently.
7. Verify billing events and make business operations idempotent.
8. Use structured logs, request IDs, tests, and controlled errors.
9. Document every mock, limitation, and production requirement.
10. Treat security, reliability, and evaluation as ongoing engineering work.

## Capstone modules

- API and application services
- Tenant authorization
- Subscription and entitlement services
- Document ingestion and retrieval
- Groq LLM provider adapter
- Guardrails and answer validation
- Usage accounting and quotas
- Billing integration
- Observability and evaluation

## Testing priorities

- Tenant isolation
- Authorization and entitlements
- Retrieval quality
- Unsupported answers
- Provider failures and timeouts
- Duplicate webhooks
- Concurrent quota enforcement
- Usage accounting and recovery

## Career takeaway

Be able to explain the problem, architecture, trade-offs, tests, and limitations of every project you claim to have built. A well-tested and clearly documented project is more valuable than an extensive feature list you cannot demonstrate.
