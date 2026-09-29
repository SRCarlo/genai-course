# Day 108 — LLM Caching & Intelligent Request Optimization

## Objective

Learn and implement caching and request optimization techniques for LLM applications.

## Topics Covered

- Exact-match caching
- Cache keys
- TTL
- LRU-style cache eviction
- Cache hit and miss metrics
- Semantic caching concepts
- Request deduplication
- In-flight request sharing
- Cache invalidation
- Tenant isolation
- Prompt/model versioning
- Cache performance benchmarking
- Cost optimization

## Implemented Components

### 1. Memory Cache

Implemented an in-memory cache with:

- Maximum entry limit
- TTL expiration
- Get/set/delete operations
- Cache clearing
- Eviction tracking

### 2. Deterministic Cache Keys

Cache keys include relevant request information:

- Tenant ID
- User ID
- Model
- Prompt version
- Context version
- Query
- Temperature
- Language

This prevents unrelated requests from sharing cached responses.

### 3. Groq LLM Service

The LLM integration uses:

- Groq API
- Model: `openai/gpt-oss-20b`

The API key is loaded from environment variables.

### 4. Cache Metrics

Tracked metrics include:

- Hits
- Misses
- Total requests
- Hit rate
- Miss rate
- Cache errors
- Evictions
- Saved LLM calls

### 5. Request Deduplication

Concurrent requests with the same cache key share the same in-flight Promise.

Example:

100 identical simultaneous requests can result in:

- 1 LLM request
- 100 consumers receiving the result

### 6. Semantic Cache

A semantic cache implementation was added to demonstrate similarity-based cache lookup.

Semantic caching can improve hit rates for similar questions but requires careful similarity thresholds and correctness validation.

### 7. Cache Invalidation

Cache invalidation utilities support:

- Key deletion
- Prefix-based invalidation
- Complete cache clearing

## Thunder Client API

### Health Check

GET:

`http://localhost:3000/`

### Chat

POST:

`http://localhost:3000/api/chat`

Body:

```json
{
  "query": "What is LLM caching?",
  "tenantId": "company-a",
  "userId": "user-101",
  "temperature": 0.2,
  "language": "en"
}
```

The first request is served by Groq.

The same request again is served from cache.

### Cache Metrics

GET:

`http://localhost:3000/api/cache/metrics`

### Clear Cache

DELETE:

`http://localhost:3000/api/cache`

## Benchmark

A mock benchmark was implemented using:

- 1000 total requests
- 100 unique questions
- 20ms simulated LLM latency
- $0.01 estimated cost per LLM call

### Results

| Strategy           | LLM Calls | Cache Hits | Hit Rate | Estimated Cost |
| ------------------ | --------: | ---------: | -------: | -------------: |
| No Cache           |      1000 |          0 |       0% |            $10 |
| Exact Cache        |       100 |        900 |      90% |             $1 |
| Deduplicated Cache |       100 |        0\* |     0%\* |             $1 |

\*Deduplicated requests share in-flight Promises, so they are not counted as completed-cache hits.

## Key Learning

Caching can significantly reduce repeated LLM calls, latency, and estimated cost.

Request deduplication additionally prevents multiple simultaneous identical requests from creating duplicate LLM work.

## Important Production Considerations

Caching must consider:

- User authorization
- Tenant isolation
- Sensitive data
- Prompt versions
- Model versions
- Cache expiration
- Invalidation
- Similarity thresholds
- Cache stampede protection
- Observability
- Cost tracking

## Conclusion

Day 108 demonstrated how caching and intelligent request optimization can improve LLM application performance and reduce unnecessary model calls.
