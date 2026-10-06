# Day 115 — GenAI SaaS API Keys, Secrets & Secure Credential Management

A runnable Node.js + Express project that demonstrates:

- cryptographically secure API-key generation
- SHA-256 API-key hashing
- one-time plaintext key display
- API-key authentication
- active/revoked/expired lifecycle
- rotation
- scopes
- tenant isolation
- `lastUsedAt`
- secret-safe logging and errors
- Groq AI gateway using `openai/gpt-oss-20b`
- `/v1/chat`
- audit events
- Node's built-in test runner

## Requirements

- Node.js 22+
- a Groq API key

## Setup

```bash
npm install
copy .env.example .env
```

On macOS/Linux:

```bash
cp .env.example .env
```

Put your Groq key in `.env`:

```env
GROQ_API_KEY=your_real_groq_key
GROQ_MODEL=openai/gpt-oss-20b
```

## Create the first API key

Because the project stores only hashes, the easiest secure bootstrap is the CLI:

```bash
npm run create:key
```

The command creates a key for the demo tenant and writes the plaintext credential to `.local-api-key`.

Do not commit `.local-api-key`.

## Run

```bash
npm run dev
```

or:

```bash
npm start
```

## Test

```bash
npm test
```

## API examples

Read the demo API key from `.local-api-key`.

### Create another key

```bash
curl -X POST http://localhost:3000/v1/api-keys \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Production backend\",\"scopes\":[\"chat:write\",\"usage:read\"]}"
```

The plaintext key is returned only in this create response.

### List keys

```bash
curl http://localhost:3000/v1/api-keys \
  -H "Authorization: Bearer YOUR_API_KEY"
```

The list never returns the full secret.

### Chat

```bash
curl -X POST http://localhost:3000/v1/chat \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"message\":\"Explain API-key rotation in simple words.\"}"
```

The key must have `chat:write`.

### Rotate

```bash
curl -X POST http://localhost:3000/v1/api-keys/KEY_ID/rotate \
  -H "Authorization: Bearer YOUR_API_KEY"
```

The old key becomes revoked and the new plaintext key is returned once.

### Revoke

```bash
curl -X DELETE http://localhost:3000/v1/api-keys/KEY_ID \
  -H "Authorization: Bearer YOUR_API_KEY"
```

## Architecture

```text
Client
  |
  | Bearer API key
  v
Authentication
  |
  v
SHA-256 hash
  |
  v
Find credential
  |
  +--> status
  +--> expiration
  +--> tenant
  +--> scope
  |
  v
/v1/chat
  |
  v
Groq AI Gateway
  |
  v
openai/gpt-oss-20b
  |
  v
Audit event
```

## Important

This project intentionally uses a JSON file instead of a database so the Day 115 security concepts are easy to inspect. For production, move the same record model to a database with a unique index on `keyHash`, and use a managed secret store for provider credentials.
