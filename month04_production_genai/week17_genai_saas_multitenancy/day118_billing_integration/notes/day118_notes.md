# Day 118 — Production GenAI SaaS Billing Integration Notes

## Objective
Build a Node.js billing integration with checkout sessions, webhook signature verification, idempotency, subscription state management, and a Groq-powered optional billing-help endpoint.

## Key concepts
- **Checkout session:** temporary payment-provider resource for completing a purchase.
- **Provider adapter:** isolates provider-specific API calls from business logic.
- **Webhook:** server-to-server event notification.
- **Signature verification:** verifies a request against a signing protocol.
- **Idempotency:** prevents repeated requests/events from repeating logical side effects.
- **Event inbox:** records received events for deduplication and recovery.
- **Dead-letter workflow:** isolates events that continue failing.
- **Reconciliation:** compares provider state with internal state.
- **Entitlements:** determine which features and usage limits a tenant may access.

## Core rules
1. Never trust browser-supplied prices.
2. Never treat a checkout redirect as proof of payment.
3. Verify signatures using the real provider's official protocol.
4. Preserve raw webhook bytes when required.
5. Persist provider event IDs and enforce database uniqueness.
6. Protect business operations against duplicates, not just event ingestion.
7. Handle retries, failures, and out-of-order events.
8. Update subscription state and event status atomically when possible.
9. Reconcile provider records with internal state.
10. Enforce tenant entitlements and AI usage limits server-side.

## Demo architecture
Frontend → Express API → Checkout Service → Mock Provider

Provider → Raw Webhook → Signature Verification → Event Store → Subscription State

Optional AI help → Express API → Groq API (`openai/gpt-oss-20b`)

## Demo limitations
The mock provider and in-memory storage are for learning only. They do not charge money, persist state across restarts, coordinate multiple instances, or implement a real provider's signature protocol. Production requires durable storage, real provider verification, authenticated tenant identity, concurrency control, retryable processing, monitoring, and reconciliation.

## Revision questions
- Why must webhook signatures be verified?
- Why is an in-memory Map insufficient for production idempotency?
- What is the difference between request and event idempotency?
- Why can webhook events arrive out of order?
- How does a dead-letter queue improve recovery?
- How should a GenAI SaaS enforce monthly token limits?
- Why must Groq API keys stay on the server?
