# Day 123 — Observability

This archive contains the new observability modules, request-ID tests, notes, and integration guides.

Copy:

- `src/observability/logger.js`
- `src/observability/request-context.js`
- `src/observability/metrics.js`
- `tests/observability.test.js`
- `notes-day123.md`

Merge, don't overwrite:

- Merge `package-scripts-merge.json` into your existing `package.json`.
- Follow `integration/app-js-integration.md` to add middleware and health endpoints.
- Follow `integration/chat-service-integration.md` to instrument actual service calls.
- Merge `integration/workflow-step.yml` into the existing GitHub Actions test job.

The existing `app.js` and `chat.service.js` are not included as replacement files because their exact Day 122 contents were not attached. Blind replacement could remove working routes or security checks.

Install/test:

```powershell
npm install pino pino-http
npm run test:observability
```
