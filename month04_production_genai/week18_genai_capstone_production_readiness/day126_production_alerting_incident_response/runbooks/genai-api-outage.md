# Runbook: GenAI API Degradation or Outage

## Purpose
Restore the GenAI API safely while protecting customer data and preserving evidence.

## 1. Confirm the incident
- Record the incident start time and alert ID.
- Check the alert metric, evaluation window, sample count, and runbook.
- Check `/health/live` and `/health/ready`, if implemented.
- Verify whether the issue affects all users, one endpoint, one provider, or a subset of tenants.
- Compare current success rate and latency with the Day 125 SLOs.

A successful liveness check does not prove that retrieval and generation work correctly.

## 2. Establish incident ownership
- Assign an incident lead and identify investigators and the communications owner.
- Record severity and user impact.
- Escalate suspected security or cross-tenant access incidents immediately.

## 3. Investigate using safe evidence
- Correlate application logs using request IDs and inspect trace IDs and span durations.
- Separate API, retrieval, database, and model-provider failures.
- Check deployment history, provider errors, timeouts, rate limits, and dependency health.
- Do not put prompts, retrieved documents, credentials, or authorization headers in incident notes.

## 4. Mitigate safely
- Roll back a verified problematic deployment using the approved procedure.
- Apply a documented feature flag or disable an affected nonessential feature.
- Reduce load or apply bounded, jittered retries where safe.
- Use a validated fallback provider only if data-handling, authorization, and quality requirements remain satisfied.
- Preserve tenant isolation, authentication, usage limits, and audit requirements.

Do not blindly increase retries or switch providers; these can increase cost, load, and data-handling risk.

## 5. Verify recovery
- Confirm successful requests have returned to expected levels.
- Check latency and provider failure metrics.
- Test a representative retrieval-and-generation flow.
- Verify tenant boundaries and authorization behavior.
- Confirm alert recovery in the monitoring system and watch for recurrence.

## 6. Communicate and close
- Share known impact, mitigation, and the next update time.
- Record the timeline, root cause if known, and unresolved questions.
- Create follow-up actions with owners and due dates.
- Conduct a blameless postmortem for significant incidents.

## Escalation
If customer data may have been exposed or tenant isolation may have failed, follow the security incident process immediately. Preserve evidence and use approved privacy, legal, and notification procedures.

## Common failure patterns
| Symptom | First checks | Potential mitigation |
| --- | --- | --- |
| Many API 5xx responses | Recent deployments, exception logs, database health | Roll back a confirmed bad release or restore a failed dependency |
| Retrieval becomes slow | Vector store latency, query duration, connection pool | Reduce load or address the bottleneck |
| LLM calls time out | Provider status, timeout settings, rate limits | Apply bounded retries or a validated fallback |
| Quality evaluation regresses | Evaluation diff, prompt changes, retrieval changes | Roll back or fix the change and rerun evaluations |
| Missing metrics or traces | Exporter health, SDK initialization, collector availability | Restore telemetry and treat the blind spot as a separate issue |
| Possible cross-tenant leakage | Authorization decisions, retrieval filters, access audit trail | Contain access and escalate as a security incident |
