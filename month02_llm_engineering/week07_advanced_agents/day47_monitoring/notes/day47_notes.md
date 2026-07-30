# Day 47 — Monitoring & Observability (Production AI Operations)

---

# 1. Introduction

Monitoring and Observability are essential for running AI systems in production.

Difference:

## Building AI Project

Focus:

- Model integration
- Prompt engineering
- Agent creation
- RAG implementation


## Running AI Product

Focus:

- Reliability
- Performance
- Cost control
- Debugging
- User experience

---

# 2. What is Monitoring?

Monitoring answers:

> Is my AI system healthy?

Monitoring tracks:

- Requests
- Errors
- Latency
- Token usage
- Cost
- System health


Example:

```
User

↓

AI Chatbot

↓

Response
```


Monitoring questions:

- How many users today?
- How many requests failed?
- How much money spent?
- How many tokens consumed?
- How fast is response?


---

# 3. What is Observability?

Observability answers:

> Why is my system failing?


Example:


Monitoring:

```
Response Time = 15 seconds
```


Observability:

```
Retriever Slow

↓

Database overloaded

↓

Root Cause Found
```


Observability uses:

- Logs
- Metrics
- Traces


---

# 4. Monitoring vs Observability


| Monitoring | Observability |
|---|---|
| Detects problems | Finds root cause |
| Shows system health | Explains failures |
| Uses metrics | Uses logs, traces, metrics |
| "What happened?" | "Why happened?" |


---

# 5. AI Production Architecture


```
User

↓

Frontend (Next.js)

↓

Express API

↓

Agent Layer

↓

RAG System

↓

LLM

↓

Response

↓

Monitoring System
```


Every layer needs monitoring.


---

# 6. Important AI Metrics


## Request Metrics

Track:

- Requests per minute
- Requests per hour
- Requests per day


## Error Metrics

Track:

- API errors
- Database errors
- Tool errors
- Model errors


## Latency Metrics

Measure:

- Response speed
- Agent execution time
- Retrieval time


Example:

```
500ms
1 second
5 seconds
```


## Token Metrics

Track:

- Prompt tokens
- Completion tokens
- Total tokens


## Cost Metrics

Track:

- Cost per request
- Cost per user
- Daily cost
- Monthly cost


---

# 7. Logging


Logging records events.

Example:


```json
{
"userId":"123",
"action":"chat_request",
"time":"2026-07-30"
}
```


Logger helps in:

- Debugging
- Auditing
- Error investigation


---

# 8. Metrics


Metrics are numerical measurements.


Examples:

```
Requests: 1000

Errors: 5

Latency: 800ms

Tokens: 500000
```


---

# 9. Tracing


Tracing follows a request lifecycle.


Example:


```
Request ID: 123

↓

API

↓

Retriever

↓

Agent

↓

LLM

↓

Response
```


Tracing helps find:

- Slow components
- Failed steps
- Agent issues


---

# 10. Latency Monitoring


Latency measures response time.


Example:


```javascript
const start = Date.now();


processRequest();


const end = Date.now();


console.log(end-start);
```


---

# 11. Token Monitoring


Token tracking helps control:

- Performance
- Cost
- Model usage


Example:

```
Prompt Tokens: 200

Completion Tokens: 100

Total Tokens: 300
```


---

# 12. Cost Monitoring


AI cost depends on:

- Model
- Input tokens
- Output tokens


Formula:


```
Cost = Total Tokens × Token Price
```


Example:


```
10000 tokens × price
```


---

# 13. LangSmith


LangSmith provides:

- LLM tracing
- Agent debugging
- Evaluation
- Monitoring


Used for:

- LangChain applications
- AI agents
- Production debugging


---

# 14. OpenTelemetry


OpenTelemetry is an industry standard for:

- Distributed tracing
- Metrics
- Logs


Used in:

- Cloud applications
- Microservices
- AI platforms


---

# 15. Production Monitoring Stack


Common stack:


```
Frontend:
Next.js


Backend:
Express


LLM:
OpenAI / Groq


Tracing:
OpenTelemetry


AI Monitoring:
LangSmith


Logs:
Winston


Dashboard:
Grafana
```


---

# Interview Questions and Answers


# Beginner Level


## Q1. What is monitoring?

### Answer:

Monitoring is the process of observing an application's health and performance using metrics, logs, and alerts.

In AI systems monitoring tracks:

- Requests
- Errors
- Latency
- Tokens
- Cost


---

## Q2. What is observability?

### Answer:

Observability is the ability to understand the internal state of a system by analyzing outputs like logs, metrics, and traces.

Monitoring tells:

"Something is wrong."

Observability tells:

"Why it is wrong."


---

## Q3. Why is logging important?

### Answer:

Logging records system events.

It helps developers:

- Debug errors
- Track user activity
- Understand failures
- Audit system behavior


---

## Q4. What is tracing?

### Answer:

Tracing follows a request through different components.

Example:

```
API

↓

Agent

↓

Retriever

↓

LLM

↓

Response
```

It helps identify slow or failed components.


---

## Q5. Why track latency?

### Answer:

Latency affects user experience.

Tracking latency helps:

- Find slow services
- Improve response speed
- Optimize AI pipelines


---

# Intermediate Level


## Q6. What metrics should AI systems track?

### Answer:

AI systems should track:

- Request count
- Error rate
- Response latency
- Token usage
- Cost
- Hallucination rate
- Retrieval accuracy
- Tool failures


---

## Q7. How do you monitor token usage?

### Answer:

Token usage can be monitored by recording:

- Input tokens
- Output tokens
- Total tokens

Every LLM request should store token information.


---

## Q8. How do you calculate AI cost?

### Answer:

Formula:


```
Cost = Input Tokens × Input Price
       +
       Output Tokens × Output Price
```


The system should track cost:

- Per request
- Per user
- Daily
- Monthly


---

## Q9. What is distributed tracing?

### Answer:

Distributed tracing tracks a request across multiple services.

Example:


```
Frontend

↓

API Server

↓

Agent

↓

Database

↓

LLM
```


It helps identify where failures occur.


---

## Q10. What is OpenTelemetry?

### Answer:

OpenTelemetry is an open-source observability framework used for collecting:

- Logs
- Metrics
- Traces


It provides standard monitoring across systems.


---

# Advanced Level


## Q11. How would you monitor an AI agent?

### Answer:

I would monitor:

1. Agent execution time
2. Tool calls
3. Tool failures
4. LLM latency
5. Token usage
6. Cost
7. Final response quality
8. User feedback


Architecture:


```
User

↓

Agent

↓

Tools

↓

LLM

↓

Tracing

↓

Dashboard
```


---

## Q12. How would you build an observability platform?

### Answer:

Components:

```
Application

↓

Logging Layer

↓

Metrics Collector

↓

Tracing System

↓

Storage

↓

Dashboard

↓

Alerts
```


Technology examples:

- Winston
- Prometheus
- OpenTelemetry
- Grafana


---

## Q13. How do you detect AI failures in production?

### Answer:

Monitor:

- Error rate
- Latency spikes
- Token increase
- Failed tool calls
- Bad user feedback
- Hallucination detection


Create alerts when thresholds are exceeded.


---

## Q14. How do you monitor RAG systems?

### Answer:

Monitor:


Retrieval:

- Search latency
- Retrieved document quality
- Retrieval accuracy


Generation:

- Answer quality
- Hallucinations
- Token usage


Pipeline:

- Embedding failures
- Vector database failures


---

## Q15. How would you design an alerting system?

### Answer:

Architecture:


```
Metrics

↓

Threshold Rules

↓

Alert Engine

↓

Notification

↓

Team
```


Example alerts:


```
Error rate > 5%

↓

Send alert


Latency > 5 seconds

↓

Send alert
```


---
