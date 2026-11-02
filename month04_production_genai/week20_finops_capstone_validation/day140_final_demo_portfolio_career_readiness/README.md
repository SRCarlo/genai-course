# Multi-Tenant GenAI SaaS Knowledge Assistant

An educational GenAI capstone project focused on document-based question answering using Retrieval-Augmented Generation (RAG).

## 1. Project Overview

### Problem Statement

Organizations store important information across documents and knowledge bases. Finding relevant information manually takes time and reduces productivity.

### Solution

A conversational AI knowledge assistant designed to retrieve relevant document information and generate contextual answers using an LLM.

### Target Users

- Organizations
- Internal support teams
- Knowledge management teams
- SaaS customers

## 2. Core Features

- Conversational AI interface
- Document-based question answering
- Retrieval-Augmented Generation architecture
- Tenant-aware application design
- Usage tracking and token cost estimation
- Budget and quota management concepts
- Observability and health-check examples
- Release verification and readiness documentation

## 3. Technology Stack

| Area        | Technology                             |
| ----------- | -------------------------------------- |
| Frontend    | Next.js, React                         |
| Backend     | Node.js, Express.js                    |
| Language    | JavaScript                             |
| AI          | LLM APIs, Prompt Engineering           |
| RAG         | Chunking, Embeddings, Vector Retrieval |
| Engineering | Git, GitHub, Docker, CI/CD concepts    |

## 4. System Architecture

Typical request flow:

**User → Next.js Frontend → Express API → RAG Pipeline → LLM → Response**

Supporting systems:

- Authentication and authorization
- Tenant isolation
- Usage tracking
- Cost governance
- Observability
- Evaluation
- Deployment and release checks

See [System Architecture](docs/architecture.md).

## 5. Project Documentation

- [Project Overview](docs/project-overview.md)
- [System Architecture](docs/architecture.md)
- [Capstone Demo Script](docs/demo-script.md)
- [Known Limitations](docs/known-limitations.md)
- [Portfolio Checklist](docs/portfolio-checklist.md)
- [Resume Project Description](portfolio/resume-project-description.md)

## 6. Project Status

**Educational Capstone / Prototype**

Some course exercises use mocked authentication, mock retrieval, mock LLM integrations, and in-memory services.

These must not be represented as completed production integrations.

See [Known Limitations and Production Gaps](docs/known-limitations.md).

## 7. Testing

Run relevant test commands from their respective project directories.

Example:

```bash
node --test tests/release-verifier.test.js
```

The Day 139 release verifier test suite completed with 11 passing tests.

## 8. Security Considerations

- Tenant identity must be verified through trusted server-side authentication.
- Client-provided tenant IDs must not be treated as proof of membership.
- Retrieval must enforce tenant and document permissions.
- API keys and credentials must be stored securely.
- Never commit `.env` files, access tokens, or production credentials.

## 9. Production Roadmap

1. Integrate real authentication and authorization.
2. Implement persistent tenant-filtered vector retrieval.
3. Connect a verified LLM provider adapter.
4. Replace in-memory usage tracking with durable storage.
5. Add real monitoring and alerting.
6. Complete tenant-isolation and RAG evaluation tests.
7. Deploy using a secure CI/CD pipeline.
8. Capture screenshots and record a project demo.

## 10. Disclaimer

This project demonstrates learning and engineering concepts for a GenAI SaaS application.

Production readiness requires real integrations, testing, security verification, and deployment evidence.

---

**Learning Journey:** 140-Day Generative AI Engineering Program  
**Capstone:** Multi-Tenant GenAI SaaS Knowledge Assistant
