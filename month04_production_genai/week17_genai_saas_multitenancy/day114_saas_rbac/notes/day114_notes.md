# Day 114 — Authentication, Authorization & RBAC

## Authentication

Authentication answers: who are you?

## Authorization

Authorization answers: what are you allowed to do?

## 401 vs 403

- 401: unauthenticated.
- 403: authenticated but forbidden.

## RBAC

User -> Role -> Permissions

## Tenant isolation

Always enforce the tenant boundary before resource access:

```js
user.tenantId === resource.tenantId;
```

## Resource authorization

Tenant access is not enough for user-owned resources. Check ownership or resource-level permissions too.

## AI tool authorization

The application must verify permissions before executing tools. The LLM must never be the authority for authorization.

## Groq

This project uses Groq's official JavaScript SDK and the production model `openai/gpt-oss-20b`.
