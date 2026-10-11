# Day 120 Assignment — Multi-Tenant GenAI SaaS Capstone

## Objective

Build and document an end-to-end GenAI SaaS knowledge assistant that demonstrates tenant access, RAG, LLM orchestration, usage accounting, and subscription entitlements.

## Phase 1 — Core vertical slice

- Run the Express API locally.
- Implement the chat application service.
- Connect tenant-scoped retrieval and the Groq LLM adapter.
- Return source metadata and usage information.
- Handle empty retrieval and provider failures.

## Phase 2 — Tenant security

- Replace demo identity headers with verified authentication.
- Verify tenant membership on every protected route.
- Apply tenant filters inside retrieval queries.
- Test cross-tenant access denial.
- Document data retention and authorization boundaries.

## Phase 3 — Usage and billing

- Connect entitlements to the chat request path.
- Enforce request and token quotas.
- Design atomic usage reservations.
- Handle duplicate billing events safely.
- Document subscription state and cancellation policy.

## Phase 4 — Quality and observability

- Add request IDs and structured logs.
- Record latency, model usage, and estimated cost.
- Build a small golden dataset for RAG evaluation.
- Test unsupported questions and retrieval failures.
- Test provider timeout and error scenarios.

## Phase 5 — Documentation

- Write a reproducible README.
- Add architecture and production-readiness documents.
- Document mocks, limitations, and environment variables.
- Add screenshots or a short recorded demo.
- Include example API requests and test commands.

## Acceptance criteria

1. A developer can run the project using documented instructions.
2. The primary chat workflow works with the documented adapters.
3. Entitlement checks happen before expensive AI calls.
4. Tenant isolation is enforced by trusted server-side identity and data-access rules.
5. Automated tests cover successful requests and important failures.
6. The README accurately describes what is implemented and what remains.
7. The repository contains no committed credentials or real API keys.

## Stretch goals

- Replace mock retrieval with PostgreSQL and pgvector.
- Implement hybrid search and reranking.
- Add durable usage events and atomic quota reservations.
- Add billing-provider integration and reconciliation.
- Deploy a staging environment with monitoring and an evaluation suite.
