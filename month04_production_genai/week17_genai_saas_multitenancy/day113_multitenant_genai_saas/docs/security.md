# Security Notes

## API keys

The demo uses in-memory demo keys so the project is easy to learn.

Production should:

1. Generate high-entropy keys.
2. Show the raw key only once.
3. Hash the key before persistence.
4. Store metadata separately.
5. Support rotation.
6. Support revocation.
7. Support expiration.
8. Audit key creation and use.

## Tenant identity

Do not trust:

```json
{
  "tenantId": "tenant-b"
}
```

from an untrusted client.

Derive tenant identity from authenticated credentials.

## Logging

Do not blindly log request bodies. Requests may contain customer documents,
secrets, API keys, or personal information.

Prefer metadata such as request ID, tenant ID, model, status and latency.

## AI-specific concerns

Multi-tenant GenAI also needs controls for:

- prompt injection
- sensitive data leakage
- cross-tenant cache pollution
- cross-tenant RAG retrieval
- excessive token consumption
