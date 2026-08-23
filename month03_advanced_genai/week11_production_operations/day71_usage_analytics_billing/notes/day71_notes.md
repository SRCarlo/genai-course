# DAY 71 — USAGE ANALYTICS & BILLING

## Model

Groq: put user model here!


## Usage

Track:

- requestId
- userId
- tenantId
- model
- endpoint
- inputTokens
- outputTokens
- totalTokens
- latency
- status
- cost
- timestamp

## Usage vs Billing

Usage:
What the customer consumed.

Provider Cost:
What Groq charges for model usage.

Customer Billing:
What our SaaS charges the customer.

These must remain separate.

## Cost

GPT-OSS 20B:

Input:
$0.075 / 1M tokens

Output:
$0.30 / 1M tokens

## Analytics

Aggregate by:

- user
- tenant
- model
- endpoint
- day
- month

## Budget

70% → warning

85% → high

95% → critical

100% → budget exceeded

## Request ID

requestId connects:

Request
↓
Logs
↓
LLM
↓
Usage
↓
Cost
↓
Analytics
↓
Billing

## Idempotency

requestId should be unique.

Duplicate usage events must not increase billing twice.

## Security

Never trust tenantId from:

- request body
- query string
- arbitrary client header

Production tenant identity should come from authenticated identity.

## Architecture

User
↓
Authentication
↓
Authorization
↓
Rate Limit
↓
Quota
↓
Budget
↓
Groq
↓
Usage
↓
Cost
↓
Analytics
↓
Billing
↓
Alerts
↓
Dashboard

## Production Scaling

API
↓
Queue
↓
Usage Worker
↓
Analytics Database
↓
Dashboard

Do not make expensive analytics aggregation part of the synchronous AI response path.
