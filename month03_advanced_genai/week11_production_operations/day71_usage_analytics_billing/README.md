# Day 71 — GenAI Usage Analytics, Billing & Cost Monitoring

Production-oriented GenAI usage tracking system.

## Stack

- Node.js
- Express
- Groq API
- GPT-OSS 20B
- JWT-compatible architecture
- Usage analytics
- Cost monitoring
- Budget alerts

## Groq Model

openai/gpt-oss-20b

## Start

Install:

npm install

Development:

npm run dev

Production:

npm start

Tests:

npm test

Monthly report:

npm run report

## Health

GET /health

## AI

POST /api/ai/chat

## Usage

GET /api/usage/me

GET /api/usage/tenant

GET /api/usage/daily

GET /api/usage/monthly

GET /api/usage/:requestId

## Analytics

GET /api/analytics/overview

GET /api/analytics/models

GET /api/analytics/tenants

GET /api/analytics/users

GET /api/analytics/endpoints

GET /api/analytics/daily

GET /api/analytics/monthly

## Billing

GET /api/billing/plans

GET /api/billing/tenant
