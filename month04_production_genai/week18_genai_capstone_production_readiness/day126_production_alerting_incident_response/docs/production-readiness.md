# Production Readiness Review

## Implemented in this learning capstone

- Modular Express API and request validation.
- Groq chat-completions adapter configured for `openai/gpt-oss-20b`.
- Tenant membership and subscription-entitlement service contracts.
- Tenant-filtered keyword retrieval.
- Basic source metadata, response structure checks, and usage recording.
- Request IDs, structured logs, HTTP security headers, rate limiting, and controlled errors.
- Unit and HTTP API tests.

## Mocked or in-memory

- Identity: local demo headers only; not suitable for deployment.
- Documents: hard-coded in-memory sample records.
- Retrieval: keyword matching only; no embeddings/vector database.
- Usage: in-memory array; data disappears on restart.
- Subscription state: hard-coded repository.
- Billing: not implemented.
- Quotas: per-IP request rate limit exists, but tenant token quotas and atomic reservations are not implemented.

## Required before deployment

- Integrate verified authentication and server-side tenant membership checks.
- Replace all demo auth with trusted identity claims; do not deploy demo headers.
- Use PostgreSQL with migrations and pgvector or a dedicated vector store.
- Enforce tenant filters in every database query and cache key.
- Add durable, idempotent usage ledger and atomic quota reservation.
- Implement verified, idempotent billing webhooks.
- Add document upload validation, malware scanning, size limits, safe parsing, and retention policies.
- Add retrieval/groundedness evaluation using a representative golden dataset.
- Review prompt injection, PII handling, secret storage, CORS, rate limits, dependency updates, backups, and incident response.
- Add integration tests against the real Groq API in a controlled environment.
- Configure production metrics, traces, alerting, and cost monitoring.

A successful local demo does not certify production readiness.
