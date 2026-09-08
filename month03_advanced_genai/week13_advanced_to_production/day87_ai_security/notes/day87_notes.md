# Day 87 — Production AI Security & Prompt Injection Defense

## Core principle

Treat every external input and every LLM-generated output as untrusted until validated.

## Topics

- Direct prompt injection
- Indirect prompt injection
- RAG trust boundaries
- Input validation
- Secure prompting
- Output validation
- Tool authorization
- Least privilege
- Human approval
- Security logging
- Rate limiting
- Security regression testing

## Architecture

User
→ Request ID
→ Rate limit
→ Input validation
→ Injection detection
→ Retrieval
→ Untrusted context boundary
→ Groq GPT-OSS 20B
→ Output validation
→ Source validation
→ Security logging
→ Response

## Interview answer

I would treat user input, retrieved documents, tool output, and LLM output as untrusted. I would combine authentication and authorization, input validation, rate limiting, injection detection, explicit RAG trust boundaries, output validation, tool authorization, least privilege, risk checks, human approval for high-impact actions, audit logging, and continuous security regression tests.
