# Authentication

Day 114 uses Bearer API keys for the learning project.

Request:

```http
Authorization: Bearer sk-member
```

The authentication flow is:

1. Read the Authorization header.
2. Require the Bearer scheme.
3. Hash the supplied API key with SHA-256.
4. Look up the hash in the API-key registry.
5. Resolve the user.
6. Reject inactive users.
7. Put the authenticated user on `req.user`.

Production systems should store only securely generated key material or hashes and should support rotation/revocation through persistent storage.
