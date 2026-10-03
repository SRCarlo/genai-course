# Architecture

Client → API Gateway → Authentication → Rate Limit → AI Gateway → Cache → Model Router → Provider Router → Retry/Circuit Breaker → Fallback → Cost Tracking → Evaluation → Observability → Response.

Provider adapters use Groq's OpenAI-compatible Chat Completions endpoint with `openai/gpt-oss-20b`.
