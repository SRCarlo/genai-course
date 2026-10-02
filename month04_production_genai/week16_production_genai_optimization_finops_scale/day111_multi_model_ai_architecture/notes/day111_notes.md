# Day 111 — Multi-Model & Multi-Provider AI Architecture

## Core concepts

- Multi-model architecture
- Multi-provider architecture
- Model routing
- Provider routing
- Model registry
- AI Gateway
- Provider adapters
- Capability routing
- Cost-aware routing
- Provider health
- Fallback
- Request deadlines
- Observability
- A/B testing
- Shadow traffic
- Model migration
- Vendor lock-in reduction

## This implementation

The real LLM integration is Groq using:

`openai/gpt-oss-20b`

Provider A is the real Groq provider. Provider B and Provider C are test/fallback adapters.

## Important production lesson

Do not spread provider-specific SDK calls throughout business routes.

Use:

Application
-> AI Gateway
-> Model Router
-> Provider Adapter
-> Provider

This keeps provider changes isolated.
