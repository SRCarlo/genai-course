# Agentic RAG Architecture

## Overview

The Day 62 project combines a ReAct agent with a retrieval augmented generation pipeline.

## Architecture

User
↓
Express API
↓
Agent
↓
Groq LLM
↓
Tool Decision
↓
knowledge_search / calculator
↓
Tool execution
↓
Observation
↓
Agent
↓
Final answer

## RAG Flow

Question
↓
Query Rewriter
↓
Embedding
↓
Vector Search
↓
Top-K
↓
Similarity Filtering
↓
Context Builder
↓
Agent

## Agent State

```javascript
{
  goal: "...",
  history: [],
  observations: [],
  iteration: 0,
  toolCalls: 0,
  ragCalls: 0,
  maxIterations: 10,
  maxRagCalls: 3,
  maxToolCalls: 6,
  sources: [],
  status: "running",
  finalAnswer: null
}
```
