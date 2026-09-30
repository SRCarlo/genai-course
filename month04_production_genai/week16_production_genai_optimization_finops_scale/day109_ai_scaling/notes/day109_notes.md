# Day 109 — AI Scaling, Load Testing & Capacity Planning

## Core Principle
Don't scale blindly. Measure the system, find the bottleneck, control concurrency, apply backpressure, and then scale the component that actually limits capacity.

## Metrics
- Throughput
- RPS
- Concurrency
- Average latency
- p50
- p95
- p99
- TTFT
- Tokens/sec

## Testing
- Load testing: expected traffic
- Stress testing: beyond expected capacity
- Spike testing: sudden traffic increase
- Endurance testing: sustained workload
- Capacity testing: reliable supported workload

## Scaling
- Horizontal: add instances
- Vertical: add resources to an instance
- Worker pools: control expensive operations
- Autoscaling: change capacity based on workload

## Protection
- Queueing
- Backpressure
- Rate limiting
- Concurrency limits
- Timeouts
- Exponential backoff
- Jitter
- Maximum retries
- Graceful degradation

## Capacity
Required workers = Target throughput / Throughput per worker

Example:
100 RPS / 5 RPS per worker = 20 workers

With 25% headroom:
20 × 1.25 = 25 workers

## Production Mental Model
Traffic
→ Load Balancer
→ Stateless API
→ Cache
→ Queue
→ Worker Pool
→ RAG / Tools
→ LLM Provider
