# Day 136 — Staging Deployment Checklist

## Release candidate

- [ ] Version identifier assigned.
- [ ] Full Git commit SHA recorded.
- [ ] Build artifact digest recorded and verified.
- [ ] CI tests and AI evaluations passed for the exact release.
- [ ] Security scan results reviewed.

## Environment

- [ ] Staging uses separate credentials and data.
- [ ] Environment variables are validated at startup.
- [ ] Provider spending limits are configured.
- [ ] Database and vector-store connections are verified.
- [ ] No production secrets are copied into staging.
- [ ] Test accounts have only the permissions they need.

## Deployment

- [ ] Deployment completes without errors.
- [ ] Database migrations are compatible with the application.
- [ ] Liveness endpoint responds successfully.
- [ ] Readiness endpoint verifies required dependencies.
- [ ] Deployed version matches the release candidate.
- [ ] Smoke-test script passes.

## Application workflow

- [ ] Authentication works with a staging account.
- [ ] Tenant authorization is verified.
- [ ] Document upload and retrieval work where supported.
- [ ] LLM errors and provider rate limits are handled.
- [ ] Usage and budget records are persisted correctly.
- [ ] Logs, metrics and traces are available.

## Recovery

- [ ] Rollback procedure is documented.
- [ ] Database migration rollback or forward-recovery plan exists.
- [ ] Previous artifact is identifiable.
- [ ] On-call contact and escalation procedure are documented.

## Decision

- PASS — all mandatory checks have verified evidence.
- BLOCKED — a mandatory check failed or is missing.
- REVIEW REQUIRED — human assessment is outstanding.

Release version:
Git commit:
Artifact digest:
Staging URL:
Smoke-test result:
Known issues:
Reviewer:
Date:
