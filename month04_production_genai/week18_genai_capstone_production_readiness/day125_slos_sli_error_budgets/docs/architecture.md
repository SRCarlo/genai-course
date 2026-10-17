# Architecture — Day 120 GenAI SaaS Capstone

## Request lifecycle

1. Request context assigns or validates an `x-request-id`.
2. Helmet applies baseline HTTP security headers.
3. The development-only demo identity middleware reads demo tenant/user headers.
4. Rate limiting is applied to `/api/chat`.
5. The route validates the question.
6. `TenantAccessService` verifies the user's tenant membership.
7. `EntitlementService` checks the active subscription and `basicChat` feature.
8. `MockRetriever` filters documents by the authorized tenant ID and ranks matching terms.
9. `GroqLLMAdapter` sends source context and the question to Groq using `openai/gpt-oss-20b`.
10. The response structure and usage values are validated.
11. Usage is recorded in memory and source metadata is returned.

## Module boundaries

- `api/`: HTTP routing, request context, demo identity, and error mapping.
- `application/`: chat orchestration and ordering of business operations.
- `tenancy/`: tenant membership authorization contract.
- `entitlements/`: subscription feature authorization.
- `ai/retrieval/`: tenant-scoped mock retrieval adapter.
- `ai/llm/`: provider-neutral contract and Groq provider implementation.
- `ai/guardrails/`: structural response checks; not a factuality guarantee.
- `usage/`: usage-accounting contract implemented in memory for this learning project.
- `observability/`: structured Pino logs and request IDs.

## Important limitations

This is a runnable learning capstone, not a production-ready SaaS. Authentication uses demo headers only outside production; production mode disables that identity provider and therefore requires a real authentication middleware to be added. Retrieval and usage are in-memory. The current retriever uses keyword matching, not embeddings or semantic vector search. Billing is not connected to a payment provider.
