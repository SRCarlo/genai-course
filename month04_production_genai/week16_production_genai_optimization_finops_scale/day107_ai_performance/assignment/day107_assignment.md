# Day 107 Assignment — AI Performance Optimization & Latency Engineering

## Task 1 — Performance Instrumentation
Run `/api/performance/demo` and record authentication, retrieval, reranking, LLM and total latency.

## Task 2 — Latency Budget
Use `src/performance/performance-budget.js`. Verify whether each measured stage exceeds its budget.

## Task 3 — Sequential vs Parallel
Run `npm run parallel-demo`. Compare sequential (~1000ms) with parallel (~500ms).

## Task 4 — Concurrency Test
Run the benchmark with different concurrency values such as 1, 2, 5 and 10. Compare p50, p95, p99, throughput and error rate.

## Task 5 — Streaming
Start the server and call `/api/chat/stream`. Measure TTFT and TTLT from SSE events.

## Task 6 — Timeout Testing
Run `npm test` and verify fast and slow operations.

## Task 7 — Bottleneck Experiment
Call `/api/performance/demo?slowLlmMs=3000` and observe that LLM becomes the dominant stage.

## Task 8 — Optimization
Compare sequential vs parallel execution and streaming vs non-streaming behavior.

## Task 9 — Performance Regression
Save baseline and optimized benchmark reports and compare TTFT, p50, p95, p99, throughput, error rate and cost.

## Task 10 — Production Recommendation
Write the biggest bottleneck, optimization, latency improvement, quality impact, cost impact, security considerations and remaining bottlenecks.
