# Day 109 Assignment — AI Scaling, Load Testing & Capacity Planning

## Task 1 — Baseline
Run:
npm run baseline

Record:
- RPS
- p50
- p95
- p99
- errors

## Task 2 — Concurrency
Run:
npm run stress

Test concurrency:
1, 5, 10, 20, 50, 100

## Task 3 — Stress
Find the first degradation point.

Record:
- first degradation point
- peak throughput
- p95
- p99
- error rate

## Task 4 — Spike
Run:
npm run spike

Observe:
- latency
- errors
- recovery

## Task 5 — Endurance
Run:
npm run endurance

For local practice, this implementation runs for 2 minutes.

Record:
- initial latency
- final latency
- memory
- errors

## Task 6 — Worker Scaling
Change MAX_CONCURRENT_LLM:
1, 2, 4, 8

Compare RPS, p95, p99 and errors.

## Task 7 — Cache Comparison
Add/reuse the Day 108 cache and compare:
- without cache
- with cache
- LLM calls
- RPS
- p95
- p99
- estimated cost

## Task 8 — Concurrency Limit
Set:
MAX_CONCURRENT_LLM=5

Verify active LLM calls never exceed 5.

## Task 9 — Backpressure
Set:
MAX_QUEUE_SIZE=100

When full, API returns HTTP 429.

## Task 10 — Capacity Plan
Given:
Target = 500 RPS
Worker capacity = 20 RPS

Required workers:
500 / 20 = 25

Add and document your chosen headroom.
