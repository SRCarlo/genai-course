# Day 53 - Open-Source LLMs & Local AI with Ollama

## Overview

This project demonstrates how to build a Local AI API using:

- Node.js
- Express.js
- Ollama
- Llama 3.2 3B

The application accepts prompts through an Express API and forwards them to a locally running LLM using Ollama.

---

## Project Structure

```
day53_local_llm/
│
├── server/
├── client/
├── scripts/
├── notes/
├── docs/
├── assignment/
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## Installation

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm run dev
```

---

## Run Ollama

```bash
ollama pull llama3.2:3b
ollama run llama3.2:3b
```

---

## API

### POST /api/chat

Request:

```json
{
  "prompt": "Explain Express.js."
}
```

Response:

```json
{
  "success": true,
  "response": "Express.js is..."
}
```

---

## Learning Outcomes

- Open-weight models
- Local inference
- Ollama
- Express integration
- REST APIs
- Local AI architecture
- Hybrid AI concepts
