# DAY 69 — AUTHENTICATION & AUTHORIZATION

## Authentication

Authentication answers:

> Who are you?

Implemented:

- JWT access tokens
- Password hashing
- Login
- Registration
- Refresh tokens
- API-key concept

---

## Authorization

Authorization answers:

> What are you allowed to do?

Implemented:

- RBAC
- Admin routes
- Resource ownership
- Tenant authorization

---

## HTTP

### 401

Authentication missing or invalid.

Examples:

- No token
- Invalid JWT
- Expired JWT
- Invalid API key

### 403

Authentication succeeded but authorization failed.

Examples:

- Normal user accessing admin endpoint
- User accessing another user's document
- Cross-tenant access

---

## JWT

JWT structure:

HEADER.PAYLOAD.SIGNATURE

The payload contains claims such as:

- sub
- role
- tenantId
- plan
- type

Never put:

- passwords
- API secrets
- private keys
- sensitive data

inside JWT payloads.

---

## Password Security

Never store:

password = "User12345!"

Instead:

Password
↓
bcrypt
↓
Password Hash
↓
Database

---

## Multi-Tenancy

Tenant A:

- User A1
- User A2
- Documents A

Tenant B:

- User B1
- User B2
- Documents B

Tenant A must never access Tenant B data.

---

## Resource Ownership

Authorization must not depend only on role.

A user request should be checked using:

userId

- tenantId
- resource ownership

  ***

## Tenant-Aware RAG

User
↓
JWT
↓
Trusted tenantId
↓
Tenant-filtered retrieval
↓
Context
↓
Groq
↓
Answer

Never retrieve all tenants' documents and rely on the LLM to hide them.

---

## Groq

This project uses Groq instead of OpenAI.

Flow:

Application
↓
groq-sdk
↓
Groq Chat Completions
↓
Model
↓
Response

---

## AI Security

Authentication

- Authorization
- Tenant Isolation
- Rate Limiting
- Quota
- Input Validation
- Tenant-Aware Retrieval
- Output Validation

  ***

## AI Cost Control

Plans:

Free
→ small quota

Pro
→ larger quota

Enterprise
→ high/custom quota

---

## Refresh Tokens

Access token:

- short-lived
- frequently used
- sent to protected APIs

Refresh token:

- longer-lived
- used to obtain new access token
- should be protected carefully
- should be rotated
- should support revocation

---

## Security Tests

Test:

- no JWT
- invalid JWT
- expired JWT
- wrong role
- wrong owner
- wrong tenant
- invalid API key
- invalid input
- rate limit
- AI quota

---

## Final Security Architecture

User
↓
Authentication
↓
Authorization
↓
Tenant Check
↓
Rate Limit
↓
Quota
↓
Input Validation
↓
Tenant-Aware RAG
↓
Groq
↓
Output Validation
↓
Response
