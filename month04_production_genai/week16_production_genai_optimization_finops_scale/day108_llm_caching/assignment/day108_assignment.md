# Day 108 Assignment — LLM Caching & Intelligent Request Optimization

## Objective

Build and evaluate an LLM caching system that reduces unnecessary model calls and improves application performance.

## Requirements

The implementation should demonstrate:

1. Exact-match caching
2. Deterministic cache keys
3. TTL-based expiration
4. Cache metrics
5. Request deduplication
6. Cache invalidation
7. Semantic caching concepts
8. Performance benchmarking
9. Cost estimation
10. Tenant and request isolation

## Implementation

The project uses Groq with:

```text
Model: openai/gpt-oss-20b
```

The implementation contains:

```text
src/cache/
src/llm/
src/metrics/
tests/
evaluation/
reports/
```

## API Endpoints

### GET /

Checks whether the API is running.

### POST /api/chat

Accepts a question and returns an LLM response.

Example:

```json
{
  "query": "What is LLM caching?",
  "tenantId": "company-a",
  "userId": "user-101",
  "temperature": 0.2,
  "language": "en"
}
```

### GET /api/cache/metrics

Returns cache performance metrics.

### DELETE /api/cache

Clears the current in-memory cache.

## Benchmark

The mock benchmark contains:

- 1000 requests
- 100 unique questions
- 20ms simulated LLM latency
- $0.01 estimated cost per LLM call

### Benchmark Results

#### No Cache

- Requests: 1000
- LLM calls: 1000
- Cache hits: 0
- Hit rate: 0%
- Estimated cost: $10

#### Exact Cache

- Requests: 1000
- LLM calls: 100
- Cache hits: 900
- Cache misses: 100
- Hit rate: 90%
- Estimated cost: $1

#### Deduplicated Cache

- Requests: 1000
- LLM calls: 100
- Cache misses: 100
- Estimated cost: $1

Deduplicated requests share the same in-flight Promise. Therefore, consumers served by the in-flight request are not counted as normal cache hits.

## Learning Outcome

The assignment demonstrates that repeated LLM requests can be optimized by caching completed responses and deduplicating concurrent requests.

The benchmark shows the potential reduction in model calls and estimated model cost.

## Production Considerations

A production implementation should additionally consider:

- Redis or another distributed cache
- Semantic cache similarity thresholds
- Cache invalidation strategies
- Cache stampede prevention
- Stale-while-revalidate
- Cache warming
- LRU eviction
- Authentication and authorization
- Tenant isolation
- Prompt and model versioning
- Monitoring and observability

## Deliverables

- Source implementation
- Unit tests
- Benchmark
- Benchmark report
- Notes
- Assignment documentation
- README
