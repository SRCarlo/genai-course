# Day 110 Failure Matrix

| Failure                   | Detection        | Response                |
| ------------------------- | ---------------- | ----------------------- |
| API instance down         | Health check     | Route traffic elsewhere |
| Redis unavailable         | Connection error | Degraded mode           |
| Queue unavailable         | Queue health     | Reject or fallback      |
| LLM timeout               | Timeout          | Retry / fallback        |
| LLM 429                   | HTTP status      | Exponential backoff     |
| Primary model unavailable | Circuit breaker  | Fallback provider       |
| Database unavailable      | Health check     | Degraded mode           |
| Vector DB unavailable     | Query failure    | Fallback retrieval      |
| Worker failure            | Worker health    | Restart worker          |
| Network failure           | Request error    | Retry / fallback        |
