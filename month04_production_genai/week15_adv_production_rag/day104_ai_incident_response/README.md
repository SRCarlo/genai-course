# Day 104 — AI Security Incident Response & Production Resilience

This project implements the Day 104 production-resilience concepts:

- AI security incidents
- Kill switch
- Feature flags
- Circuit breaker
- Safe LLM/RAG fallback
- Incident logging
- Incident state machine
- Request correlation IDs
- RAG poisoning simulation
- Tenant-isolation incident scenario
- Postmortem template
- Optional Groq incident analysis

## Stack

- Node.js
- JavaScript ES Modules
- Node built-in test runner
- Groq SDK
- `openai/gpt-oss-20b`

## 1. Install

```powershell
npm install
```

## 2. Configure Groq

Create `.env` from `.env.example`.

```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-20b
```

Do not commit `.env`.

## 3. Run tests

```powershell
npm test
```

The tests do not require a Groq API key.

## 4. Run demo

```powershell
npm run demo
```

## 5. Run Groq incident analysis

```powershell
npm run analyze
```

This requires a valid `GROQ_API_KEY`.

## Production resilience model

```text
AI Application
      ↓
Detection
      ↓
Triage
      ↓
Containment
      ↓
Investigation
      ↓
Remediation
      ↓
Recovery
      ↓
Postmortem
      ↓
Security Improvement
      ↺
```

## Circuit breaker

```text
CLOSED
  ↓ failures
OPEN
  ↓ timeout
HALF_OPEN
  ↓ success
CLOSED
```

## Security rule

Security-sensitive decisions should fail closed.

Retrieval failures should not cause fabricated answers.

## Git

```powershell
git add .
git commit -m "feat(day104): complete ai incident response and production resilience"
git push origin master
```
