# Day 110 Architecture

Users -> Load Balancer -> Stateless API Instances -> Cache -> Queue -> AI Workers -> AI Gateway -> Groq -> openai/gpt-oss-20b

Resilience: health checks, readiness, graceful shutdown, timeout, retry, circuit breaker, fallback and graceful degradation.
