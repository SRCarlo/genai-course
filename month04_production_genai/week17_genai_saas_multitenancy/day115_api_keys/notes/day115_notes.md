# Day 115 — API Keys, Secrets & Credential Security

## API keys

API keys authenticate clients to the API.

A key record contains:

- unique ID
- tenant ID
- user ID
- name
- prefix
- scopes
- status
- createdAt
- expiresAt
- revokedAt
- lastUsedAt

## Storage

The plaintext key is returned only when created.

The persistent record stores:

```text
plain API key
     ↓
SHA-256 hash
     ↓
database/file
```

The full key is never returned by list endpoints.

## Lifecycle

```text
CREATED → ACTIVE → REVOKED
                 └→ EXPIRED
```

Rotation revokes the old credential and creates a new credential.

## Scopes

Examples:

- chat:read
- chat:write
- rag:read
- rag:write
- agents:run
- usage:read

A request must have the required scope.

## Role vs scope

Role is user-level authorization.

Scope is credential-level API access.

Both can participate in authorization.

## Tenant isolation

Every API key belongs to one tenant.

A credential belonging to tenant A must never authorize access to tenant B.

## Secret protection

Never place provider credentials in:

- frontend JavaScript
- browser local storage
- Git repositories
- logs
- error responses

Development uses `.env`.

Production should use a managed secret-management system.

## Groq AI gateway

```text
Customer
  ↓
SaaS API
  ↓
API-key authentication
  ↓
Tenant boundary
  ↓
Scope authorization
  ↓
AI gateway
  ↓
Groq
  ↓
openai/gpt-oss-20b
```

The Groq credential remains server-side.

## GenAI security

The LLM is not the security authority.

Authorization must happen before model execution and independently before sensitive tool execution.
