# Day 56 — Production RAG Architecture

## 1. System Overview

The AI Knowledge Base Assistant is a full-stack RAG
application.

The system consists of:

- Next.js frontend
- Express backend
- Query processing
- Cache
- Vector retrieval
- Keyword retrieval
- Hybrid retrieval
- Reranking
- Context selection
- Ollama LLM
- Source attribution
- Evaluation
- Monitoring

---

# 2. High-Level Architecture

```text
                         USER
                           |
                           v
                    +-------------+
                    |   Next.js   |
                    |  Frontend  |
                    +------+------+
                           |
                           | POST /api/chat
                           v
                    +-------------+
                    |   Express   |
                    |     API     |
                    +------+------+
                           |
                           v
                    +-------------+
                    | Request ID  |
                    +------+------+
                           |
                           v
                    +-------------+
                    |   Query     |
                    | Processing  |
                    +------+------+
                           |
                           v
                    +-------------+
                    |    Cache    |
                    +------+------+
                           |
                     Cache Miss
                           |
                           v
              +------------+------------+
              |                         |
              v                         v
       +-------------+           +-------------+
       |   Vector    |           |  Keyword    |
       |   Search    |           |   Search    |
       +------+------+           +------+------+
              |                         |
              +------------+------------+
                           |
                           v
                    +-------------+
                    |    Hybrid   |
                    |    Fusion   |
                    +------+------+
                           |
                           v
                    +-------------+
                    |  Reranker   |
                    +------+------+
                           |
                           v
                    +-------------+
                    |   Context   |
                    |   Builder   |
                    +------+------+
                           |
                           v
                    +-------------+
                    |   Ollama    |
                    |    LLM      |
                    +------+------+
                           |
                           v
                    +-------------+
                    |   Answer +  |
                    |   Sources   |
                    +------+------+
                           |
                           v
                    +-------------+
                    |  Frontend   |
                    +-------------+
```
