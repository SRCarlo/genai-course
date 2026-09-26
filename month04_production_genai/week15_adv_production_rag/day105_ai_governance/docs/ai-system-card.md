# AI System Card

## System
AI-001 — Customer Support Assistant

## Purpose
Customer support Q&A using approved knowledge sources.

## Users
Authorized customer-support users.

## Model
Provider: Groq  
Model: `openai/gpt-oss-20b`  
Version: v1

## RAG
Enabled. Only approved knowledge sources should be indexed.

## Tools
Disabled in this demo.

## Data
PUBLIC and INTERNAL data only by default.

## Risk Level
MEDIUM.

## Known Limitations
- Model responses can contain errors.
- Retrieval quality affects answer quality.
- The demo policy is not a complete legal/compliance framework.

## Security Controls
- API key in environment variable
- Data classification checks
- Server-side authorization requirement
- Governance risk register
- Human approval for high-impact actions

## Evaluation
Evaluation and security review are required before model changes are promoted.

## Monitoring
Usage, errors, security events and governance review status should be monitored.

## Human Oversight
High-impact actions require human review.

## Owner
Engineering / AI Platform

## Review Date
2026-09-26
