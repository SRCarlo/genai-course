# Day 54 - Advanced RAG

## Features

- Semantic Retrieval
- Keyword Retrieval
- Hybrid Search
- Query Transformation
- Reranking
- Context Builder
- Ollama Integration
- Source Tracking
- Retrieval Evaluation

## Run

Install dependencies

```bash
npm install
```

Start Ollama

```bash
ollama serve
```

Start Express

```bash
npm start
```

API

```
POST /api/rag/ask
```

Example

```json
{
  "question": "What is Express middleware?"
}
```
