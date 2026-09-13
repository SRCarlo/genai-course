# Day 92 Assignment

# Multi-Agent Research Assistant

## Objective

Build a multi-agent AI system using specialized agents.

## Agents

1. Supervisor Agent
2. Router Agent
3. Node.js Research Agent
4. Spring Boot Research Agent
5. FastAPI Research Agent
6. Analysis Agent
7. Reviewer Agent
8. Writer Agent

## Architecture

User
↓
Supervisor
↓
Parallel Research Agents
↓
Analysis Agent
↓
Reviewer Agent
↓
Writer Agent
↓
Final Result

## AI Provider

Groq

## AI Model

openai/gpt-oss-20b

## Features

- Specialized agents
- Supervisor orchestration
- Router
- Parallel execution
- Structured communication
- Structured output
- Zod validation
- Permission boundaries
- Workflow state
- Partial failure handling
- Rate limiting
- Retry
- Token budget
- Agent tracing
- Handoff protocol

## Example Task

Compare Node.js, Spring Boot, and FastAPI for building AI backend APIs.

## Comparison Areas

- Architecture
- Ecosystem
- Performance
- AI integration
- Developer experience
- Production suitability

## Production Safety

The workflow uses:

- maximum agents
- maximum handoffs
- maximum LLM calls
- maximum runtime
- rate limiting
- retry handling
- structured output validation
- permission boundaries
