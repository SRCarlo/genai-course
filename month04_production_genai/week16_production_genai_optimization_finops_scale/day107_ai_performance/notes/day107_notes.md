# Day 107 — AI Performance Optimization & Latency Engineering

## Core Principle

Measure → Profile → Identify Bottleneck → Optimize → Benchmark → Verify Quality → Monitor

## Key Metrics

- Latency: time required to complete an operation.
- TTFT: Time to First Token.
- TTLT: Time to Last Token.
- p50: median latency.
- p95: latency at or below which approximately 95% of requests fall.
- p99: latency at or below which approximately 99% of requests fall.
- Throughput: requests processed per unit time.

## Optimization Principles

- Parallelize independent operations.
- Keep dependent operations sequential.
- Use streaming to improve perceived responsiveness and TTFT.
- Reuse connections where possible.
- Set explicit timeouts.
- Control concurrency and apply backpressure.
- Move long-running work to async jobs.
- Benchmark before and after optimization.
- Validate quality, security, reliability and cost after performance changes.

## Groq Integration

This project uses Groq with `openai/gpt-oss-20b` through `groq-sdk`.
The API key is read from `GROQ_API_KEY` and must never be committed.
