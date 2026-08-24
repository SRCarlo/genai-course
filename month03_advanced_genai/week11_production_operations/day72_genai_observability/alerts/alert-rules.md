# Day 72 — Alert Rules

## 1. API Error Rate

WARNING:

API error rate > 2%

HIGH:

API error rate > 5%

CRITICAL:

API error rate > 20%

---

## 2. AI Error Rate

WARNING:

AI error rate > 2%

HIGH:

AI error rate > 5%

CRITICAL:

AI error rate > 20%

---

## 3. AI p95 Latency

WARNING:

p95 > 3 seconds

HIGH:

p95 > 5 seconds

CRITICAL:

p95 > 10 seconds

---

## 4. AI Cost

WARNING:

Daily AI cost > $25

HIGH:

Daily AI cost > $50

CRITICAL:

Daily AI cost > $100

---

## 5. Token Anomaly

WARNING:

Token usage > 2x normal

HIGH:

Token usage > 5x normal

CRITICAL:

Token usage > 10x normal

---

## 6. RAG

WARNING:

Retrieval failure > 2%

HIGH:

Retrieval failure > 5%

CRITICAL:

Retrieval failure > 15%

---

## 7. Agent

WARNING:

Average iterations > 5

HIGH:

Average iterations > 10

CRITICAL:

Agent loop detected

---

## 8. Tool failures

WARNING:

Tool failure > 2%

HIGH:

Tool failure > 5%

CRITICAL:

Tool failure > 15%

---

## Alert Investigation

Alert
↓
Request ID
↓
Correlation ID
↓
Logs
↓
Metrics
↓
Trace
↓
Model
↓
Tenant
↓
Token usage
↓
Cost
↓
Root cause
