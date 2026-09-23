# Day 102 — AI Safety, Guardrails & Secure RAG Notes

## Core Principle

AI applications must treat user input, retrieved documents and model output as potentially untrusted.

## Guardrail Layers

1. Input guardrails
2. Retrieval guardrails
3. Generation guardrails
4. Output guardrails

## Prompt Injection

Prompt injection attempts to manipulate model behavior using malicious instructions.

### Direct Injection

The attacker sends the malicious instruction directly.

### Indirect Injection

The malicious instruction exists inside external content such as documents or web pages.

## Secure RAG

Retrieved documents should be treated as untrusted data.

Use explicit boundaries between:

- system instructions
- reference data
- user input

## Authorization

Authorization should happen before retrieval.

For multi-tenant systems use:

- tenant ID
- document permissions
- visibility
- ownership

## Tool Security

LLM tool calls are untrusted.

Validate:

- tool name
- tool arguments
- user permissions
- tool risk

High-risk tools should use stronger authorization and potentially human confirmation.

## Output Validation

LLM output should be validated before being used by application code.

## PII

Sensitive information should be detected and handled according to application policy.

## Secrets

Never place API keys, passwords or other credentials inside prompts.

## Fail Closed

When a security decision cannot be verified safely:

DENY

rather than:

ALLOW

## Defense in Depth

Input validation
→ authorization
→ secure retrieval
→ context boundaries
→ tool policy
→ output validation
→ monitoring

## Important Principle

An LLM is not a security boundary.

Security must be enforced by the surrounding application.

## Groq Configuration

This project uses:

- Provider: Groq
- Model: `openai/gpt-oss-20b`
- SDK: `groq-sdk`
- Secret: `GROQ_API_KEY`

The model call is isolated in `src/ai/rag/rag-service.js`.
