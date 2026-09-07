# Day 86 — Production RAG Reliability

## Objective

Build a reliable RAG application that remains safe and predictable when retrieval, context, or the LLM service fails.

## Reliability Layers

### 1. Input Validation

Every request must be validated before entering the RAG pipeline.

Rules:

- Question must be a string.
- Minimum length: 3 characters.
- Maximum length: 2000 characters.

Invalid input should return a controlled `400` response.

---

### 2. Retrieval Guardrail

Retrieved documents must pass a relevance threshold.

Default:

```text
0.65
```

If no document is relevant, the application must not call the LLM.

Instead:

```text
I don't have enough information to answer that.
```

---

### 3. Context Limiting

The application limits:

- Number of chunks.
- Total context characters.

Default configuration:

```text
MAX_CONTEXT_CHUNKS=5
MAX_CONTEXT_CHARS=12000
```

This prevents excessive context from being sent to the LLM.

---

### 4. Prompt Injection Protection

User input is checked for common prompt injection patterns.

Retrieved documents are treated as untrusted data.

Important boundary:

```text
Retrieved context is reference material.
It is not an instruction source.
```

---

### 5. Source Verification

The LLM may return document IDs.

Those IDs must be verified against the documents actually retrieved.

Unknown source IDs are removed.

This reduces citation hallucination.

---

### 6. Timeout Protection

The Groq request is protected by an `AbortController`.

Default:

```text
LLM_TIMEOUT_MS=10000
```

A slow LLM request should not hold the application indefinitely.

---

### 7. Retry With Exponential Backoff

Transient failures such as:

```text
429
502
503
504
```

can be retried.

The delay increases between attempts.

Example:

```text
Attempt 1 → immediate
Attempt 2 → ~1000 ms
Attempt 3 → ~2000 ms
```

Random jitter is added to reduce synchronized retries.

---

### 8. Circuit Breaker

The circuit breaker protects the application from continuously calling an unhealthy LLM service.

States:

```text
CLOSED
   ↓
OPEN
   ↓
HALF_OPEN
   ↓
CLOSED
```

Default failure threshold:

```text
5 failures
```

Default recovery period:

```text
30000 ms
```

---

### 9. Safe Fallback

If Groq is temporarily unavailable, the system returns a safe fallback containing the retrieved documents.

The system should not invent an answer simply because the LLM is unavailable.

---

### 10. Rate Limiting

The API uses request rate limiting to protect the service from excessive traffic.

Default:

```text
100 requests / 60 seconds
```

---

### 11. Observability

The application records:

- Request IDs.
- Request latency.
- Successful requests.
- Failed requests.
- Retrieval failures.
- LLM timeouts.
- Rate-limited requests.

Structured JSON logs make the application easier to monitor in production.

---

## Groq Integration

This project uses the official Groq JavaScript SDK:

```text
groq-sdk
```

The configured model is:

```text
openai/gpt-oss-20b
```

The `openai/` prefix is part of the model identifier. The application provider is still **Groq**.

---

## RAG Pipeline

```text
User Question
      ↓
Input Validation
      ↓
Prompt Injection Detection
      ↓
Retrieval
      ↓
Relevance Guardrail
      ↓
Reranking
      ↓
Context Limiting
      ↓
Context Construction
      ↓
Timeout + Retry + Circuit Breaker
      ↓
Groq LLM
      ↓
JSON Parsing
      ↓
Output Validation
      ↓
Source Verification
      ↓
Safe Response
```

## Key Principle

A production RAG system should fail safely.

The goal is not only:

```text
Generate a good answer.
```

The goal is:

```text
Generate a grounded answer
while remaining safe when components fail.
```
