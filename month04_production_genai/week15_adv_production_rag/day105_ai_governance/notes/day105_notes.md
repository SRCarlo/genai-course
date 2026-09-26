# Day 105 — AI Governance, Compliance & Production AI Policies

## Core Principle
Production AI requires more than engineering and security. It also requires governance, ownership, policies, risk management and evidence.

## AI Governance
AI governance defines how AI systems are developed, approved, deployed, monitored and retired.

## AI Lifecycle
Idea → Risk Assessment → Development → Evaluation → Security Testing → Approval → Deployment → Monitoring → Review → Retirement

## AI Inventory
Every production AI system should have an identifiable record containing system ID, purpose, owner, model, provider, data types, RAG status, tools, risk, environment, status and review date.

## Risk Management
Educational project formula: Impact × Likelihood.

## Data Governance
PUBLIC, INTERNAL, CONFIDENTIAL and RESTRICTED are example classifications for this project.

## Human Oversight
High-impact actions may require human review or approval.

## Model Governance
Track provider, model, version, purpose, approval, evaluation and security status.

## Auditability
Record enough evidence to understand who used the system, when, model, prompt version, retrieved documents, tool calls and security decisions.

## Governance Evidence
Risk assessments, security reports, evaluation reports, approval records, incident reports and review records.

## Groq Integration
The optional demo uses Groq with `openai/gpt-oss-20b`. The API key is loaded from `.env` and must never be committed.
