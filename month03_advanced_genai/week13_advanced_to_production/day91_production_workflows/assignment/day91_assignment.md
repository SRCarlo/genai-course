# Day 91 Assignment

## Level 1

Build a refund workflow:
getOrder → checkEligibility → refund → notify.

## Level 2

Add:
- checkpoints
- resume
- retry
- timeout
- idempotency
- background worker
- approval
- cancellation

## Level 3

Add:
- event-driven resume
- compensation
- workflow versioning
- optimistic concurrency
- audit trail
- agentic decision step
- persistent workflow storage
- failure recovery

## Expected test scenarios

1. Normal refund → COMPLETED
2. Ineligible order → COMPLETED with refund skipped
3. High-value refund → WAITING_APPROVAL
4. Approval rejected → CANCELLED
5. Transient failure → RETRY
6. Worker crash → RESUME
7. Duplicate job → only one refund side effect
