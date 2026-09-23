# Day 102 Assignment

## Task 1 — Input Validation

Implement:

- empty input protection
- maximum length
- type validation

Status: Completed in `src/security/input-validator.js`.

## Task 2 — Input Guardrails

Build:

Request → Validation → Guardrails → Allow / Reject

Status: Completed.

## Task 3 — Rate Limiting

Implement:

10 requests/minute

The test verifies that the 11th request is rejected.

## Task 4 — Secure RAG

Every document has:

- tenantId
- visibility
- ownerId

Authorization happens before retrieval.

## Task 5 — Cross-Tenant Attack

Tenant A must not retrieve Tenant B documents.

Expected:

DENIED

## Task 6 — Prompt Injection

The evaluation dataset contains:

- 10 direct injection examples
- 10 indirect injection examples

## Task 7 — Tool Security

Tools:

- searchDocuments
- getUserProfile
- deleteDocument

Only safe tools are allowed by default.

## Task 8 — Tool Argument Validation

Reject:

- invalid IDs
- missing arguments
- unexpected arguments

## Task 9 — PII

Detect and redact:

- email
- phone number

## Task 10 — Output Validation

AI response must follow:

```json
{
  "answer": "string",
  "sources": []
}
```

Malformed responses are rejected.

## Task 11 — Security Tests

Tests cover:

- input validation
- rate limiting
- authorization
- tenant isolation
- prompt injection
- tool policy
- PII detection
- output validation
