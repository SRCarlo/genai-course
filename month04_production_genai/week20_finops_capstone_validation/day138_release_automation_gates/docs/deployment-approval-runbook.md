# Production Deployment Approval Runbook

## Before approval
- [ ] Verify candidate version and commit SHA.
- [ ] Verify artifact digest.
- [ ] Review unit and integration test evidence.
- [ ] Review dependency and security scan results.
- [ ] Review AI evaluation results.
- [ ] Verify staging smoke tests.
- [ ] Review canary metrics and decision.
- [ ] Confirm rollback plan.

## Approval
- [ ] Verify approver identity.
- [ ] Confirm approver authorization.
- [ ] Confirm target environment.
- [ ] Bind approval to the exact candidate artifact.
- [ ] Record approval time and release evidence.

## Deployment
- [ ] Submit the approved candidate to the deployment controller.
- [ ] Verify the deployed version.
- [ ] Verify traffic routing.
- [ ] Run post-deployment health checks.
- [ ] Continue monitoring.

## If deployment fails
1. Stop further rollout.
2. Evaluate whether rollback is required.
3. Restore the previous known-good version.
4. Verify service health.
5. Preserve evidence for incident investigation.
6. Record the incident and corrective actions.
