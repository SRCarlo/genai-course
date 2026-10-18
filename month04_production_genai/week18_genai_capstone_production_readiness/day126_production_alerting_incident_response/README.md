# DAY 126 — Production Alerting, Incident Response & Runbooks

## Today's Goal

Learn how to detect reliability issues, respond to incidents, and improve operational readiness for a production GenAI application.

## Key Concepts

- Alert: a notification that a condition requires attention.
- Threshold: the boundary used to evaluate a measurement.
- Evaluation window: the period over which a condition is calculated.
- Pending duration: how long a condition must persist before firing.
- Severity: the urgency and impact classification of an incident.
- Deduplication: grouping repeated notifications about the same issue.
- Runbook: documented investigation and mitigation steps.
- Postmortem: a structured review of an incident and its contributing factors.

## Example Alert Rules

- API failure rate above 5%.
- API p95 latency above 800 ms.
- Model-provider failure rate above 2%.
- Suspected unauthorized cross-tenant access triggers security escalation.

These are educational examples. Real thresholds must reflect service requirements and measured traffic.

## Implementation Files

- `src/alerting/alert-rules.js`
- `src/alerting/evaluate-alerts.js`
- `src/alerting/demo-alert.js`
- `tests/alert-rules.test.js`
- `runbooks/genai-api-outage.md`
- `runbooks/postmortem-template.md`

## Test Command

`npm run test:alerting`

## Incident Lifecycle

1. Detect the incident.
2. Confirm scope and severity.
3. Assign an incident lead.
4. Investigate with safe logs, metrics, and traces.
5. Mitigate the problem.
6. Verify recovery.
7. Communicate impact and resolution.
8. Conduct a postmortem and track preventive work.

## Production Safety

- Don't blindly increase retries or timeouts.
- Don't treat missing telemetry as healthy.
- Protect prompts, documents, credentials, and authorization headers.
- Preserve tenant isolation and usage controls during mitigation.
- Escalate suspected security incidents immediately.
- Test rollback and notification procedures.
- Keep the alert evaluator separate from a real paging platform.

## Interview Revision

**Q: Why is alert fatigue dangerous?**
It makes responders less likely to notice critical notifications.

**Q: What does a runbook provide?**
Repeatable steps for investigating and mitigating a known problem.

**Q: Why use a postmortem?**
To identify contributing factors and prevent recurrence.

## Completion Checklist

- Alert evaluator implemented.
- Unit tests passing.
- Failure and latency scenarios simulated.
- Runbook created.
- CI workflow updated.
- Postmortem template created.
- Privacy and rollback safeguards reviewed.
- Git changes reviewed and committed.

## Next Day

Day 127 — Production Security Hardening, Secrets Management & Threat Modeling for GenAI.
