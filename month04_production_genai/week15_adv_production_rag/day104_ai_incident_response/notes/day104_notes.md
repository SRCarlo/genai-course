# Day 104 — AI Security Incident Response & Production Resilience

## Core Principle

Security controls reduce risk, but production systems can still fail.

A mature AI system must detect, contain, investigate and recover from incidents.

## Incident Lifecycle

Detect → Triage → Contain → Investigate → Remediate → Recover → Learn

## AI Incident Examples

- Prompt injection
- Data leakage
- PII exposure
- Tenant isolation failure
- RAG poisoning
- Tool abuse
- Provider outage
- Cost spike
- Resource exhaustion
- Authorization failure

## Kill Switch

A kill switch allows a dangerous AI feature to be disabled quickly.

## Feature Flags

Feature flags provide granular control.

Examples:

- RAG
- Tools
- External search

## Circuit Breaker

States:

- CLOSED
- OPEN
- HALF_OPEN

The circuit breaker prevents repeated calls to a failing dependency.

## Fallback

Use safe fallback behavior when a dependency fails.

Never fabricate information because retrieval or another dependency failed.

## Fail Closed

Security-sensitive decisions should generally fail closed.

Examples:

- Authorization
- Private document access
- High-risk tool execution

## Incident Logging

Useful information:

- Incident ID
- Type
- Severity
- Timestamp
- Request ID
- Security decision

Do not log secrets or unnecessary sensitive content.

## Audit Trail

Trace security events across:
API → RAG → LLM → Tools → Security

## RAG Incident Response

Detect → Quarantine → Investigate → Remove malicious content → Rebuild index → Regression tests → Recover

## Tenant Isolation Incident

Contain the retrieval path first. Investigate affected documents, users and requests before restoring service.

## Tool Abuse Incident

Disable the affected tool, preserve evidence, fix authorization and rerun security tests.

## Recovery

Use gradual rollout:
0% → internal → 5% → 25% → 50% → 100%

Monitor every stage.

## Versioning

Version:

- prompts
- models
- retrieval configuration
- embeddings
- tool policies

This makes incidents reproducible.

## Important Principle

Production AI engineering is not only about preventing failures. It is also about limiting blast radius, recovering safely and learning from incidents.
