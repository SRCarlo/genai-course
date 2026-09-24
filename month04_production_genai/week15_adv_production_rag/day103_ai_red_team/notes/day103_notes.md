# Day 103 — AI Red Teaming & Security Testing

## Core Principle
Do not only test whether an AI system works. Actively test how it can fail.

## AI Red Teaming
AI red teaming intentionally attacks an AI system to discover security and reliability weaknesses.

## Important Attack Categories
- Prompt injection
- Jailbreaks
- Indirect prompt injection
- RAG poisoning
- Data leakage
- Authorization bypass
- Tool abuse
- PII leakage
- Resource abuse
- Output manipulation

## Attack Surface
Input → Retrieval → LLM → Tools → Output

## Security Test Dataset
Each test should contain a unique ID, category, input, expected behavior, and severity.

## Security Evaluation
A runner executes the attack. An evaluator determines whether actual behavior satisfies the expected security behavior.

## Authorization
Authorization must be enforced by the application. The LLM should never be the final authorization authority.

## Tenant Isolation
Users must not access documents belonging to another tenant.

## Tool Security
Use allowlisting, argument validation, authorization, risk controls, and confirmation for high-impact actions.

## Data Leakage
Use synthetic canary secrets. Never use real credentials for security testing.

## Resource Protection
Use input limits, context limits, tool-call limits, retry limits, timeouts, and token budgets.

## Security Regression Testing
Previously discovered vulnerabilities should become permanent regression tests.

## Security Gate
Critical security failures should prevent deployment.

## Red-Team Lifecycle
Attack → Measure → Investigate → Fix → Retest → Deploy → Monitor
