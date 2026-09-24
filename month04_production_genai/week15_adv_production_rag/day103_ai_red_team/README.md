# Day 103 — AI Red Teaming

This project follows the Day 103 structure for AI red teaming, adversarial testing, security evaluation, tenant isolation, tool validation, resource limits and a production security gate.

## AI Provider

This implementation uses:

- Provider: Groq
- OpenAI-compatible API
- Model: `openai/gpt-oss-20b`

No OpenAI API key is required.

## Setup

```powershell
npm install
Copy-Item .env.example .env
```

Put your Groq key in `.env`:

```env
GROQ_API_KEY=your_key
GROQ_MODEL=openai/gpt-oss-20b
```

## Run unit/security tests

```powershell
npm test
```

## Run the Groq red-team suite

```powershell
npm run redteam
```

The report is written to:

```text
reports/day103-security-report.json
```

## Important

The evaluator is intentionally simple for learning. Production security evaluation should use stronger structured checks, deterministic authorization, schema validation, logging, rate limits, and human review for high-impact actions.
