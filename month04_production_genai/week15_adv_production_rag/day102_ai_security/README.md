# Day 102 — AI Safety, Guardrails & Secure RAG

A learning project implementing the Day 102 security concepts:

- Input validation
- Input guardrails
- Rate limiting
- Prompt-injection-aware prompt boundaries
- Secure tenant-aware retrieval
- Document authorization
- Tool allowlisting
- Tool argument validation
- PII detection and redaction
- Output validation
- Fail-closed authorization
- Security evaluation dataset
- Automated security tests
- Groq API with `openai/gpt-oss-20b`

## 1. Setup

```powershell
npm install
Copy-Item .env.example .env
```

Put your Groq API key in `.env`.

## 2. Run

```powershell
npm start
```

Server:

```text
http://localhost:3000
```

Health check:

```text
GET /health
```

## 3. Ask the secure RAG API

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:3000/api/ask `
  -Headers @{ "x-user-id"="user-a1" } `
  -ContentType "application/json" `
  -Body '{"question":"What is our leave policy?"}'
```

## 4. Run tests

```powershell
npm test
```

## Security model

```text
User
 ↓
Authentication identity
 ↓
Rate limit
 ↓
Input validation
 ↓
Input guardrails
 ↓
Authorization
 ↓
Secure retrieval
 ↓
Context validation
 ↓
Prompt builder
 ↓
Groq LLM
 ↓
Output validation
 ↓
Response
```

The LLM is not treated as the security boundary. Application code enforces security before and after the model.
