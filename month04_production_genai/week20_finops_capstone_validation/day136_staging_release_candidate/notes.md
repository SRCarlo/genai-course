# Day 136 — Staging Release Candidate and Smoke Testing

## Objective

Prepare an identifiable release candidate, validate a staging deployment and collect evidence before production promotion.

## Core concepts

- Release candidate: a specific build proposed for release.
- Staging: an isolated environment used for pre-production verification.
- Smoke test: a quick check of critical deployment behavior.
- Artifact digest: a content identifier used to verify artifact identity.
- Promotion gate: a decision based on required, verified release evidence.
- Rollback: returning to a known-good version or executing a documented recovery plan.

## Files

- `src/release/release-metadata.js`
- `src/release/deployment-check.js`
- `tests/release-metadata.test.js`
- `tests/deployment-check.test.js`
- `scripts/smoke-test.js`
- `docs/staging-checklist.md`
- `docs/release-handoff.md`

## Test commands

Run unit tests:

`node --test`

Check smoke-test script syntax:

`node --check scripts/smoke-test.js`

For a running, authorized local application:

`$env:BASE_URL = "http://localhost:3000"`  
`node scripts/smoke-test.js`

Replace port `3000` with the actual application port. If version verification is enabled, set `EXPECTED_VERSION` and expose a `/version` endpoint that returns a JSON `version` field.

## Release checklist

1. Record the version, full commit SHA and artifact digest.
2. Verify CI, security scans and AI evaluations.
3. Deploy to isolated staging.
4. Verify liveness and readiness.
5. Run smoke tests and critical integration workflows.
6. Check tenant authorization and usage persistence.
7. Review observability and known risks.
8. Record the promotion or blocking decision.

## Production limitations

The local validators do not deploy the application or independently verify CI evidence. A production release process needs trusted pipeline results, an identifiable artifact, secure staging configuration, integration testing and an actionable recovery plan.

## Completion criteria

- Unit tests pass.
- Smoke tests run against a real, authorized target.
- The deployed version matches the intended release.
- Staging and release checklists are reviewed.
- Known issues and recovery procedures are documented.
