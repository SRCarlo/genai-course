# Day 115 Assignment

## Part 1 — API Key Generation

Implement:

- generate
- hash
- store
- authenticate

## Part 2 — Key Lifecycle

Support:

- create
- active
- revoke
- expire
- rotate

## Part 3 — API Key Scopes

Support:

- chat:read
- chat:write
- rag:read
- rag:write
- agents:run
- usage:read

## Part 4 — API Endpoints

Implement:

- POST /v1/api-keys
- GET /v1/api-keys
- DELETE /v1/api-keys/:id
- POST /v1/api-keys/:id/rotate

## Part 5 — Tenant Isolation

Verify:

```text
Tenant A key → Tenant A resource → ALLOW
Tenant A key → Tenant B resource → DENY
```

## Part 6 — Scope Authorization

Verify:

```text
chat:write → POST /v1/chat → ALLOW
chat:write → agents:run      → DENY
```

## Part 7 — Secret Protection

Verify:

- `.env` is ignored
- full API keys are not logged
- list endpoints do not return full keys
- errors do not expose secrets
- Groq credentials remain server-side

## Advanced

Build:

```text
POST /v1/chat
```

Pipeline:

```text
API Key
→ hash
→ find credential
→ status
→ expiration
→ tenant context
→ chat:write scope
→ Groq AI gateway
→ response
→ audit event
```
