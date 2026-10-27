# GenAI SaaS Release Checklist

## 1. Application and API

- Production configuration validated at startup.
- Authentication and authorization tests pass.
- Request validation and safe error handling verified.
- Readiness endpoint checks actual required dependencies.
- Timeouts and bounded retries configured.

## 2. RAG and LLM

- Tenant-specific document access enforced during retrieval.
- Prompt injection and untrusted retrieved content tested.
- Tool calls validated and authorized server-side.
- Evaluation suite passes the defined release threshold.
- Model provider failures and rate limits handled safely.

## 3. Cost and usage

- Token and cost limits enforced on the server.
- Quota reservations are concurrency-safe.
- Usage ingestion is idempotent.
- Provider costs are reconciled.
- Budget alerts and over-budget behavior tested.

## 4. Security and privacy

- Secret scan reviewed.
- Dependency and container scans reviewed.
- No sensitive prompts or credentials in logs.
- Tenant isolation tests pass.
- Data retention and deletion requirements reviewed.

## 5. Operations

- CI pipeline passes on the exact release commit.
- Traces, metrics and actionable alerts verified.
- Backups and recovery procedures tested where applicable.
- Deployment and rollback rehearsed in a safe environment.
- Monitoring ownership and incident escalation documented.

## Final decision

- PASS — all required checks have verified evidence.
- BLOCKED — at least one required check failed or is missing.
- REVIEW REQUIRED — human assessment or risk approval remains outstanding.

Reviewer:
Release commit:
Date:
Evidence links:
Outstanding issues:
