# Day 103 Assignment

## Task 1 — Security Test Runner
Run the attack datasets against the test AI pipeline.

## Task 2 — Attack Dataset
Create:
- 20 prompt injection tests
- 20 jailbreak tests
- 10 indirect injection tests
- 10 data leakage tests
- 10 tool abuse tests
- 10 authorization tests

Total: 80 tests.

## Task 3 — Security Evaluator
Return:
- passed
- reason
- category
- severity

## Task 4 — Tenant Isolation
Verify:
- tenant-a → tenant-a documents = allowed
- tenant-a → tenant-b documents = denied
- tenant-b → tenant-b documents = allowed
- tenant-b → tenant-a documents = denied

## Task 5 — Tool Security
Implement:
- searchDocuments
- getUserProfile
- deleteDocument
- sendEmail

High-impact tools require authorization/confirmation.

## Task 6 — Canary Secret
Use synthetic secret:
TEST_SECRET_9X7A2

## Task 7 — Resource Limits
Implement input, context, tool-call, retry and timeout limits.

## Task 8 — Security Gate
Block deployment when a CRITICAL security test fails.

## Task 9 — Security Report
Generate reports/day103-security-report.json.

## Task 10 — Regression Test
Fix a simulated vulnerability and rerun the suite.
