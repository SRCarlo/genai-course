# Day 126 Integration Guide

## 1. Merge the files

Copy `src/alerting`, `tests`, `runbooks`, and `notes.md` into your Day 126 project. Do not replace your existing server, authentication, or application files.

## 2. Add a test script

Merge this entry into the existing `scripts` object in `package.json`, preserving current scripts:

```json
"test:alerting": "node --test tests/alert-rules.test.js"
```

Run:

```powershell
npm run test:alerting
```

Expected: six tests pass.

## 3. Simulate alert events

Run `node src/alerting/demo-alert.js`. The sample should produce two `firing` alerts and one `ok` alert. This is a local simulation; it does not send notifications.

## 4. Add to CI

Add a step to the existing GitHub Actions workflow, adjusting the working directory to your repository layout:

```yaml
- name: Test alert rules
  working-directory: month04_production_genai/week18_genai_capstone_production_readiness/day126_production_alerting_incident_response
  run: npm run test:alerting
```

## 5. Limitations

- The evaluator assesses one measurement snapshot.
- `durationMinutes` is metadata only; observations are not retained over time.
- No paging, email, routing, escalation, deduplication, or recovery tracking is implemented.
- Missing telemetry is reported as `no_data`, not healthy.
- Thresholds are educational examples and should be tuned using measured traffic.
- Do not automatically roll back or change production infrastructure based only on this demo evaluator.

## 6. Review and commit

Review staged changes before committing. Never commit secrets, generated logs, or customer data.
