# DAY 69 ASSIGNMENT

## Mandatory

- [x] Create login flow
- [x] Implement JWT authentication
- [x] Create authentication middleware
- [x] Protect /profile
- [x] Implement RBAC
- [x] Create admin-only endpoint
- [x] Implement resource ownership checks
- [x] Add tenant context
- [x] Implement tenant-aware document access
- [x] Add tenant filtering to RAG retrieval
- [x] Add authentication tests
- [x] Add authorization tests
- [x] Add cross-tenant access tests
- [x] Add security tests
- [x] Add AI quota concept

## Advanced

- [x] Refresh-token rotation
- [x] API key authentication concept
- [ ] API key hashing
- [x] API key scopes
- [ ] Permission-based authorization
- [x] Tenant-level quotas concept
- [x] Model-level permissions concept
- [ ] Admin audit logs
- [x] Token revocation concept
- [x] Session management concept

## AI Provider

OpenAI was intentionally not used.

Provider:

Groq

SDK:

groq-sdk

AI flow:

Authenticated User
↓
Tenant Context
↓
Tenant Documents
↓
Tenant-filtered RAG
↓
Groq
↓
Response
