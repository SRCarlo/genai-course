# DAY 125 — GenAI Production SLOs, SLIs, Error Budgets & Reliability Engineering

## Key concepts

- **SLI:** A measurement of actual service behavior.
- **SLO:** A target for an SLI over a defined time window.
- **SLA:** A customer-facing agreement that may include remedies.
- **Error budget:** The permitted unreliability under an SLO.
- **Burn rate:** Observed failure rate divided by allowed failure rate.
- **p50 / p95 / p99:** Median, high-percentile, and tail-latency measures.

## Example learning targets

- API success rate: 99.5%.
- API p95 latency: 800 ms.
- Model-call success rate: 99%.
- Answer-quality evaluation: 90% or higher on a defined suite.

These are educational starting points, not production guarantees.

## Error-budget example

For 10,000 eligible requests and a 99.5% SLO, the allowed failure rate is 0.5% and the budget is 50 failures. If 70 requests fail, budget usage is 140%.

## Files

- `src/reliability/reliability.js`
- `src/reliability/slo-config.js`
- `src/reliability/latency-sample.js`
- `tests/reliability.test.js`

## Test

`npm run test:reliability`

## Production lessons

1. Calculating an SLO is not the same as monitoring live traffic.
2. Define eligible requests, failure exclusions, and the measurement window.
3. Monitor retrieval and model-provider failures independently.
4. Never use prompts, private documents, API keys, or authorization headers as metric labels.
5. Keep high-cardinality values such as request IDs in logs/traces, not metric labels.
6. Passing unit tests does not prove live SLO compliance.
7. Use error budgets to guide release risk and reliability improvements.

## Completion checklist

- [ ] Implement reliability calculations.
- [ ] Test valid and invalid inputs.
- [ ] Document SLO definitions.
- [ ] Integrate request-duration measurements.
- [ ] Update the CI workflow.
- [ ] Review privacy and metric cardinality.
- [ ] Commit changes to Git.

Next: Day 126 — Production Alerting, Incident Response, Runbooks & Reliability Operations.
