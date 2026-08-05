# Day 53 - Local AI Architecture

## Application Flow

```
User
 │
 ▼
Frontend (Next.js / React)
 │
 ▼
Express API
 │
 ▼
Ollama Service
 │
 ▼
Ollama Server
 │
 ▼
Local LLM
 │
 ▼
Generated Response
 │
 ▼
Express API
 │
 ▼
Frontend
```

---

## Components

### Frontend

- Sends prompts
- Displays AI responses

### Express API

- Validates requests
- Routes prompts
- Returns responses

### Ollama

- Runs the local model
- Handles inference

### Local LLM

Processes prompts and generates responses.

---

## Hybrid AI Architecture

```
                User
                  │
                  ▼
             Express API
                  │
          ┌───────┴────────┐
          ▼                ▼
      Ollama           Cloud API
          │                │
          ▼                ▼
     Local Model      Hosted Model
```

The application can route requests depending on privacy, latency, hardware, or model capability requirements.
