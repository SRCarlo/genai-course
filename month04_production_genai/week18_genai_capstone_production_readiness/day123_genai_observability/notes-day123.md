# Day 123 — Production Observability

## Objective
Add structured logging, request correlation, latency measurement, AI usage logging, and health endpoints.

## Concepts
- Logs describe events; metrics quantify system behavior; traces connect operations.
- Request IDs correlate logs.
- `performance.now()` measures elapsed time.
- Liveness checks whether the process is running.
- Readiness checks whether the service can accept traffic.

## New files
- `src/observability/logger.js`
- `src/observability/request-context.js`
- `src/observability/metrics.js`
- `tests/observability.test.js`

## Commands
- `npm install pino pino-http`
- `npm run test:observability`
- Run existing app tests and `npm run eval`.

## Security
- Never log API keys or authorization headers.
- Avoid logging prompts and private retrieved documents.
- Use safe error codes.
- Treat request IDs as correlation values, not credentials.

## Known limitations
- JSON logs are not a metrics database.
- Request IDs do not implement distributed tracing.
- Readiness is a placeholder until real dependency checks are added.
- Token telemetry depends on provider usage data being returned by the adapter.

## Git commit
`feat(day123): add production observability`
