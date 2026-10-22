# Day 130 — Scaling, Load Testing & Backpressure

## Core Concepts

- Throughput: completed requests per second.
- Concurrency: work currently in progress.
- p50: median latency.
- p95 and p99: slower-tail latency measurements.
- Rate limiting: caps request frequency.
- Concurrency limiting: caps in-flight work.
- Backpressure: protects downstream systems from overload.
- Load testing: measures behavior under expected traffic.
- Stress testing: explores capacity limits.
- Little's Law: L = λW.

## Implementation

- src/scaling/rate-limiter.js
- src/scaling/concurrency-limiter.js
- tests/rate-limiter.test.js
- tests/concurrency-limiter.test.js
- load-tests/k6-smoke.js
- runbooks/overload-response.md

## Unit Test Results

- Rate limiter: 3 passed.
- Concurrency limiter: 1 passed.
- Total: 4 passed, 0 failed.

## Production Lessons

- In-memory rate limits are not shared across replicas.
- Queue sizes and timeouts should be bounded.
- Use trusted server-side identity for tenant limits.
- Monitor latency, errors, provider limits, token usage, and costs.
- Avoid uncontrolled retries during overload.

## Load Test Results

- Tool: k6 v2.2.0
- Endpoint: GET /health/live
- Virtual users: 2
- Duration: 20 seconds
- Requests: 40
- Failed requests: 0 (0%)
- Average response time: 2.3 ms
- p95 response time: 5.02 ms
- Result: PASS
- Scope: Local health endpoint smoke test only

## Unit Test Results

- Rate limiter: 3 passed
- Concurrency limiter: 1 passed
- Total: 4 passed, 0 failed
