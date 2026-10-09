# Day 118 Assignment — Billing Integration Reliability

## Implementation checklist
- [x] Create checkout service with server-side plan-to-price mapping.
- [x] Add request idempotency and document in-memory limitations.
- [x] Implement raw-body HMAC verification for the local demo.
- [x] Add an event-store abstraction (in-memory learning adapter).
- [x] Test duplicate webhook delivery and invalid signatures.
- [x] Add basic subscription version/state-transition protection.
- [ ] Replace the in-memory event store with PostgreSQL or another durable database.
- [ ] Add a retry worker and dead-letter workflow.
- [ ] Add reconciliation against the real provider's current state.
- [ ] Connect persisted subscription entitlements to the GenAI request path.
- [x] Write Day 118 notes and README.

## Advanced challenge
Implement a durable event inbox with:
- Unique constraint on `(provider, event_id)`.
- Status: `received`, `processing`, `processed`, or `failed`.
- Attempt count, last error, and next retry time.
- Safe worker claiming to prevent concurrent processing.
- Atomic subscription updates and event completion.
- Reconciliation for events that were never delivered.

## Acceptance criteria
Repeated delivery of the same event must not duplicate a business operation. A failed event must remain recoverable after restart.

## Interview questions
1. **Why shouldn't the frontend success page activate a subscription?** A redirect is not proof of payment. The backend must verify authoritative provider state.
2. **What is webhook signature verification?** It validates the request according to the provider's signing protocol.
3. **What is idempotency?** Repeating the same logical operation does not repeat its side effects.
4. **Why is an in-memory Map insufficient?** It loses state on restart and cannot coordinate different server instances.
5. **What is an event inbox?** A durable record used for deduplication, processing status, retry, and recovery.
6. **What is a dead-letter queue?** A place to isolate events that exceed their retry policy.
7. **What is reconciliation?** Comparing provider records with internal billing state to detect and repair discrepancies.
8. **How should duplicate invoice events be handled?** Deduplicate by provider event ID and protect invoice/entitlement side effects with business-level unique constraints.
9. **What if the database is unavailable?** If the event cannot be durably accepted, return a retryable error.
10. **How does billing integrate with GenAI usage?** Check entitlements before model calls and record usage afterward.
