# Model Routing

Logical tiers:

| Tier     | Cost   | Latency | Reasoning effort |
| -------- | ------ | ------- | ---------------- |
| fast     | low    | low     | low              |
| balanced | medium | medium  | medium           |
| quality  | high   | high    | high             |

All three tiers currently use Groq's `openai/gpt-oss-20b`; the tier controls routing policy and reasoning effort rather than pretending that three different models exist.

Capabilities configured for the model:

- reasoning
- tools
- structured output

Routing inputs:

- task
- complexity
- maximum cost tier
- required capabilities
- deadline
