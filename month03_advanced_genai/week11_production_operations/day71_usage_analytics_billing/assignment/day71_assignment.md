# DAY 71 ASSIGNMENT

## Mandatory

- [x] Create AI usage event schema
- [x] Track request ID
- [x] Track user ID
- [x] Track tenant ID
- [x] Track model
- [x] Track input tokens
- [x] Track output tokens
- [x] Track total tokens
- [x] Track latency
- [x] Track request status
- [x] Calculate request cost
- [x] Aggregate daily usage
- [x] Aggregate monthly usage
- [x] Aggregate tenant usage
- [x] Aggregate model usage
- [x] Add budget monitoring
- [x] Add budget alerts
- [x] Create usage API
- [x] Protect analytics endpoints
- [x] Write usage tests

## Advanced

- [x] Idempotent usage processing
- [x] Cost dashboard API
- [x] Tenant billing API
- [x] Model cost comparison
- [x] Monthly report
- [ ] Redis-based counters
- [ ] Queue-based usage events
- [ ] Usage anomaly detection
- [ ] Production analytics database

## AI Provider

Groq API

Model: used our model here !

## Key Lesson

AI usage is not just:

"Did the model answer?"

A production system must know:

- Who used it?
- Which tenant used it?
- Which model was used?
- How many tokens were consumed?
- How long did it take?
- What did it cost?
- Did it succeed?
- Is the tenant near its budget?
