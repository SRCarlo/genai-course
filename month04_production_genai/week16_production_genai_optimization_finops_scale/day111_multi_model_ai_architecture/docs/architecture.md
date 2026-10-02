# Day 111 Architecture

## Flow

User
-> API Gateway
-> AI Gateway
-> Model Router
-> Model Registry
-> Provider Router
-> Provider Adapter
-> Groq / fallback provider
-> Response
-> Observability metadata

## Groq integration

Provider A is the real Groq adapter.

- API key: `GROQ_API_KEY`
- Model: `openai/gpt-oss-20b`
- SDK: `groq-sdk`

Provider B and Provider C are intentionally simple fallback adapters so the routing architecture can be tested without requiring multiple paid AI accounts.

## Production evolution

Replace Provider B/C implementations with real provider SDKs while keeping the `generate(request)` contract unchanged.
