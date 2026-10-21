# Production Deployment Rollback Runbook

## Purpose
Restore the last known-good application release when a deployment causes failures.

## When to Roll Back
- Health checks fail after deployment.
- Error rates increase significantly.
- Critical application functionality stops working.
- The application cannot connect to required dependencies.

## Rollback Procedure
1. Confirm the deployment is causing the issue.
2. Notify the responsible team and record the incident.
3. Identify the last known-good release.
4. Use the deployment platform's rollback mechanism to restore that release.
5. Verify the live and ready health endpoints.
6. Run smoke tests against the restored release.
7. Review logs and confirm normal application behavior.
8. Document the incident, root cause, and corrective actions.

## Important Notes
- Follow the rollback procedure for the actual deployment platform.
- Do not assume rollback succeeded until health checks and smoke tests pass.
- Handle database migrations carefully; rolling back application code may not reverse database changes.
