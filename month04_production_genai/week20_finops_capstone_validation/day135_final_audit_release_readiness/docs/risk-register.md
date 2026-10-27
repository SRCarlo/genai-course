# Day 135 — GenAI Capstone Risk Register

## Risk 1: Cross-tenant data exposure

- Severity: Critical
- Threat: A tenant accesses another tenant's documents, chat history or usage records.
- Verification: Test API authorization and database query scoping using two different tenants.
- Mitigation: Server-side tenant membership checks, database-level filters and negative integration tests.
- Release condition: No unauthorized cross-tenant access.

## Risk 2: Exposed secrets

- Severity: Critical
- Threat: Provider keys or database credentials are exposed in source control, logs or frontend bundles.
- Verification: Scan tracked files and CI artifacts; inspect environment configuration.
- Mitigation: Secret manager, server-only configuration, least privilege and key rotation after exposure.
- Release condition: No unresolved credential exposure.

## Risk 3: Unsafe RAG retrieval

- Severity: Critical
- Threat: Retrieval returns documents outside the user's access permissions or trusts malicious instructions embedded in retrieved content.
- Verification: Test document ACL filters, adversarial retrieved content and citation correctness.
- Mitigation: Enforce access control before context assembly, treat retrieved content as untrusted, and restrict tools.
- Release condition: No unresolved access-control bypass.

## Risk 4: Uncontrolled provider spending

- Severity: High
- Threat: Retries, concurrency or missing quotas cause excessive provider usage.
- Verification: Concurrent quota tests, timeout tests and usage reconciliation.
- Mitigation: Atomic reservations, token limits, bounded retries, rate limits and a defined overage policy.
- Release condition: Spending controls are tested under failure and concurrency.

## Risk 5: Inaccurate usage analytics

- Severity: High
- Threat: Duplicate or delayed events make cost and budget dashboards inaccurate.
- Verification: Duplicate event, retry and reconciliation tests.
- Mitigation: Durable idempotency keys, event uniqueness constraints and ingestion monitoring.
- Release condition: Reporting limitations are visible and material discrepancies are investigated.

## Risk 6: Failed deployment or rollback

- Severity: High
- Threat: An incompatible migration or unhealthy release causes downtime or data loss.
- Verification: Staging deployment, health checks and rollback rehearsal.
- Mitigation: Backward-compatible migrations, versioned releases and documented recovery procedures.
- Release condition: Recovery procedure is tested for the intended release.

## Review record

- Commit SHA:
- Reviewer:
- Review date:
- Unresolved critical risks:
- Accepted risks and approver:
- Final decision: PASS / BLOCKED / REVIEW REQUIRED

This is a working risk register, not proof that any risk has been resolved.
