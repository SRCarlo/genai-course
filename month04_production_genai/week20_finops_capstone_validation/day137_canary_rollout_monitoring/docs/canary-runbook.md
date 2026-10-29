# GenAI Canary Release Runbook

## 1. Before rollout

- [ ] Identify the stable and candidate release versions.
- [ ] Record the candidate Git SHA and artifact digest.
- [ ] Verify staging smoke tests and release audit results.
- [ ] Run the AI evaluation suite against a known dataset.
- [ ] Verify tenant authorization and isolation.
- [ ] Confirm dashboards, alerts, and rollback ownership.
- [ ] Confirm database and API compatibility with the old version.

## 2. Start the canary

- [ ] Route a small, approved traffic percentage to the candidate.
- [ ] Record the rollout start time and baseline metrics.
- [ ] Verify the actual candidate version is receiving traffic.
- [ ] Check health, errors, latency, and provider failures.

## 3. Monitor the candidate

- [ ] Error rate stays within the configured limit.
- [ ] p95 latency stays within the configured limit.
- [ ] Provider cost per comparable request stays within budget.
- [ ] AI evaluation quality does not materially regress.
- [ ] Tenant isolation and authorization remain intact.
- [ ] Rate limits, quotas, and provider timeouts behave correctly.
- [ ] Minimum sample size and observation requirements are met.

## 4. Decide

- PROMOTE: all guardrails pass with sufficient evidence.
- HOLD: evidence is missing or insufficient; keep rollout paused.
- ROLLBACK: a trusted safety guardrail is breached.

## 5. After the decision

- [ ] Record the decision, evidence, version, and approver.
- [ ] Verify actual traffic routing after promotion or rollback.
- [ ] Continue monitoring after the full rollout.
- [ ] Reconcile provider usage and cost.
- [ ] Record incidents and follow-up actions.

## Emergency rollback

1. Stop increasing candidate traffic.
2. Route traffic back to the last known-good release.
3. Verify health and critical user journeys.
4. Confirm tenant boundaries and usage accounting.
5. Preserve relevant logs, traces, metrics, and release metadata.
6. Open an incident review and document the root cause.
