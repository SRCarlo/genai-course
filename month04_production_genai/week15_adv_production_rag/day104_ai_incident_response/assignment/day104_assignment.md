# Day 104 Assignment

## Task 1 — Kill Switch

Implement:

- enableAI()
- disableAI()
- isAIEnabled()

Test that disabled AI requests are rejected.

## Task 2 — Feature Flags

Create flags for:

- rag
- tools
- externalSearch

Test enabling/disabling each feature.

## Task 3 — Circuit Breaker

Implement:

- CLOSED
- OPEN
- HALF_OPEN

Test:
3 failures → OPEN → wait → HALF_OPEN → success → CLOSED

## Task 4 — Safe Fallback

Implement:

- LLM failure → safe fallback response
- RAG failure → no fabricated answer

## Task 5 — Incident Logger

Log:

- incident ID
- type
- severity
- timestamp
- request ID

Do not log secrets or unnecessary sensitive content.

## Task 6 — Incident State Machine

Implement:
OPEN → TRIAGED → CONTAINED → INVESTIGATING → REMEDIATED → RECOVERED → CLOSED

Reject invalid transitions.

## Task 7 — Request Correlation

Generate a unique request ID and use it throughout:
API → RAG → LLM → Tools → Security

## Task 8 — Simulate RAG Incident

Use malicious-document.txt.

Simulate:
upload → index → retrieve → detect poisoning

Then:
quarantine → reindex → security test

## Task 9 — Simulate Tenant Isolation Failure

Create tenant-a and tenant-b data.

Simulate unauthorized access and run:
detect → contain → investigate → remediate → recover

## Task 10 — Postmortem

Write one complete postmortem containing:

- incident
- impact
- timeline
- root cause
- containment
- remediation
- prevention
- regression tests

## Groq Integration

If AI-assisted incident analysis is enabled, use:

- Provider: Groq
- Model: openai/gpt-oss-20b
- Environment variable: GROQ_API_KEY

The core security/resilience tests must not require an API key.
