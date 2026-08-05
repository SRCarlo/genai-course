# DAY 53 — Open-Source LLMs & Local AI

## Main Concepts

- Open-source models
- Open-weight models
- Local LLMs
- Ollama
- Hugging Face
- Quantization
- Local inference
- Model serving
- Model routing

---

## Ollama

Ollama allows developers to run and serve LLMs locally.

Common commands:

```bash
ollama --version
ollama list
ollama pull <model>
ollama run <model>
ollama show <model>
ollama rm <model>
```

---

## Local Architecture

```
Next.js
   │
   ▼
Express.js
   │
   ▼
Ollama
   │
   ▼
Local LLM
```

---

## Cloud Architecture

```
Next.js
   │
   ▼
Express.js
   │
   ▼
Groq / OpenAI
   │
   ▼
Cloud LLM
```

---

## Local AI Advantages

- Privacy
- Offline capability
- More control
- Local experimentation
- No provider token charge

---

## Local AI Disadvantages

- Hardware requirements
- Maintenance
- Scaling complexity
- Potentially weaker models
- Electricity and hardware cost

---

## Quantization

Quantization reduces numerical precision (for example FP16, INT8, or 4-bit) to reduce memory requirements and potentially improve inference efficiency.

---

## Production Rule

Never expose Ollama directly to the public internet.

Preferred architecture:

```
Client
   │
   ▼
Authenticated API
   │
   ▼
Express
   │
   ▼
Ollama
   │
   ▼
Local Model
```

---

## Node.js Integration

Node.js communicates with Ollama using HTTP requests through libraries such as Axios or the built-in `fetch`.

---

## Things to Check Before Using a Model

- License
- Model size
- RAM / VRAM requirements
- Context length
- Performance
- Security considerations
