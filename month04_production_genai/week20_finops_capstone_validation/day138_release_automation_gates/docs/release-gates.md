# GenAI Release Gates

## Purpose
Prevent unsafe GenAI application releases from advancing
through the deployment pipeline.

## Required automated checks
1. Unit tests
2. Integration tests
3. Security scan
4. AI evaluation
5. Staging smoke tests

## Production-only conditions
1. Canary decision must be PROMOTE.
2. Authorized production approval is required.
3. Approval must reference the exact candidate artifact.
4. All evidence must be verified and current.

## Decision meanings

| Decision | Meaning |
|---|---|
| APPROVE | Policy allows the next stage |
| HOLD | Evidence or approval is missing |
| BLOCK | A required check failed |
| ROLLBACK | An already deployed candidate needs recovery |

## Security requirements
- Fail closed when evidence is missing.
- Never trust client-provided approval fields.
- Verify the candidate artifact digest.
- Record release decisions in an audit log.
- Restrict deployment permissions.
- Protect production credentials.
