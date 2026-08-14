# DAY 62 — Agentic RAG

## What is Agentic RAG?

Agentic RAG combines:

- Retrieval Augmented Generation
- AI Agents
- Tool Calling
- ReAct

The agent decides when to retrieve information.

## Traditional RAG

Question
↓
Retriever
↓
Documents
↓
LLM
↓
Answer

## Agentic RAG

Question
↓
Agent
↓
Decide whether retrieval is required
↓
RAG Tool
↓
Observation
↓
Agent
↓
Answer

## RAG as a Tool

knowledge_search(query)

The agent can call the RAG pipeline like any other tool.

## Components

- Agent
- ReAct loop
- RAG tool
- Retriever
- Embedding model
- Vector database
- Query rewriter
- Context builder
- Source tracker
- Calculator

## Groq

Groq is used for:

- Agent reasoning
- Tool calling
- Query rewriting
- Final answer generation

Model:

openai/gpt-oss-120b

## Embeddings

This project uses Hugging Face Transformers.js locally for embeddings.

This avoids requiring a separate embedding API.

## Important Guardrails

- Maximum iterations
- Maximum RAG calls
- Maximum tool calls
- Retrieval threshold
- Input validation
- Source tracking
- Empty-result handling
- Prompt injection protection

## Security

Retrieved documents are untrusted data.

Retrieved text must not override system instructions.

## Main Project

Company Knowledge Agent.

Features:

- ReAct
- RAG
- Vector search
- Query rewriting
- Calculator tool
- Source tracking
- Error handling
