# Day 131 — GenAI Caching Strategies

## 1. Goal

Reduce repeated LLM calls, latency, and API costs using response caching.

## 2. Exact-Match Response Caching

- Store a generated answer using a cache key.
- If the same eligible request occurs again, return the cached answer.
- A cache hit avoids another LLM call.
- A cache miss requires generating the answer.

## 3. Cache TTL

TTL means Time To Live.

- Each cache entry has an expiration time.
- Expired entries should not be served.
- TTL helps prevent old answers from remaining available indefinitely.

## 4. Cache Key Design

The cache key includes:

- tenantId
- authorizationScope
- normalized question
- model
- promptVersion
- indexVersion
- locale

The key is generated using SHA-256.

## 5. Cache Invalidation

- `get(key)` retrieves a valid cached value.
- `set(key, value, ttlMs)` stores a value.
- `del(key)` removes one entry.
- `clear()` removes all entries.
- `stats()` reports entries, hits, misses, and hit rate.

## 6. Security

- Include tenant and authorization scope in the key.
- Authenticate and authorize users before reading from the cache.
- Never allow cached responses to bypass access control.
- Cache only eligible, successful, validated responses.
- Be careful with sensitive or user-specific information.

## 7. In-Memory Cache

This implementation uses JavaScript `Map`.
Advantages:

- Simple to implement.
- Useful for local development and testing.

Limitations:

- Data is lost when the process restarts.
- Entries are not shared between multiple application instances.
- Production distributed applications may need Redis or another shared cache.

## 8. Redis

Redis can provide shared caching across application instances.
A Redis implementation should use expiration and appropriate key isolation.

## 9. Semantic Caching

Semantic caching attempts to reuse answers for questions with similar meanings.
It needs careful similarity thresholds and authorization checks.
Similar questions are not always equivalent, so incorrect cache reuse is possible.

## 10. Cost Optimization

Caching can reduce repeated model calls and improve response latency.
Actual savings depend on eligible request volume, cache hit rate, model pricing, and answer-generation costs.

## 11. Tests

The test suite covers:

- TTL expiration
- Explicit invalidation
- Tenant isolation
- Whitespace normalization
- Prompt version changes
- Index version changes
- Authorization scope changes

## 12. Production Reminder

Treat caching as an optimization, not an authorization mechanism.
Validate eligibility before storing responses and ensure cached data remains isolated by tenant and access scope.
