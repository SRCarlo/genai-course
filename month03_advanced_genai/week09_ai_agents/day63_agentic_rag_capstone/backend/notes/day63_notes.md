# DAY 63 — Agentic RAG Capstone

## Project

Company Knowledge Agent

## Concepts Combined

- AI Agents
- Tool Calling
- ReAct
- Planning
- Memory
- RAG
- Vector Search
- Query Rewriting
- Source Tracking

## Tools

1. `knowledge_search`
2. `calculator`

## Main Flow

User → Express API → Agent → Tool Decision → RAG / Calculator → Observation → Agent → Final Answer

## RAG Flow

Question → Query Rewrite → Embedding → Vector Search → Top-K → Context → Agent

## Guardrails

- Max iterations
- Max tool calls
- Max RAG calls
- Input validation
- Error handling
- Retrieval threshold

## Security

Retrieved documents are untrusted data.

Authorization must be enforced before document retrieval.

## Project Goal

Build a production-style Agentic RAG backend using Node.js and Express.
