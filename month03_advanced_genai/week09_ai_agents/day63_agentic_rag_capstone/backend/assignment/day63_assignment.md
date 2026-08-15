# Day 63 Assignment — Agentic RAG Capstone

## Mandatory Checklist

- [ ] Create project
- [ ] Add documents
- [ ] Connect RAG
- [ ] Create RAG tool
- [ ] Create calculator tool
- [ ] Create tool registry
- [ ] Create ReAct loop
- [ ] Add memory
- [ ] Add query rewriting
- [ ] Add source tracking
- [ ] Add limits
- [ ] Add Express API
- [ ] Add validation
- [ ] Add error handling
- [ ] Test all scenarios
- [ ] Write README

## Advanced Checklist

- [ ] Add reranking
- [ ] Add streaming
- [ ] Add persistent memory
- [ ] Add authentication
- [ ] Add authorization
- [ ] Add rate limiting
- [ ] Add structured agent traces

## Testing Matrix

| Test                       | Expected Tool / Flow         |
| -------------------------- | ---------------------------- |
| Hello                      | None                         |
| What is JavaScript?        | None                         |
| Refund policy              | RAG                          |
| Leave policy               | RAG                          |
| 15% of 80000               | Calculator                   |
| Bonus policy + calculation | RAG → Calculator             |
| Unknown company policy     | RAG → No result              |
| Follow-up question         | Memory → Query Rewrite → RAG |

## Unit Tests

### calculatorTool.test.js

Test:

- Addition
- Subtraction
- Multiplication
- Division
- Division by zero
- Invalid operation

### ragSearchTool.test.js

Test:

- Valid query
- Empty query
- Results found
- No results

### agent.test.js

Test:

- Direct answer
- Tool selection
- Maximum iterations
- Tool failure

### agenticRag.test.js

Test:

- RAG only
- Calculator only
- RAG + calculator
- Memory + RAG
- No retrieval result

## Interview Questions

### 1. What did you build?

I built an Agentic RAG knowledge assistant where a ReAct-based agent dynamically decides whether to use retrieval or other tools such as a calculator.

### 2. Why use an agent instead of traditional RAG?

Because not every question requires retrieval, and some tasks may require multiple tools or multiple retrieval steps.

### 3. How does the agent know when to use RAG?

The agent receives a tool description explaining that `knowledge_search` should be used for company-specific knowledge. The model decides when the tool is relevant.

### 4. How do you prevent infinite agent loops?

I use maximum iteration, tool-call, and RAG-call limits.

### 5. How do you reduce hallucinations?

I ground company-specific responses in retrieved context and instruct the model to explicitly say when the knowledge base does not contain enough information.

### 6. How do you handle malicious retrieved content?

Retrieved content is treated as untrusted data and cannot override higher-priority system instructions.

### 7. Why query rewriting?

It converts ambiguous conversational questions into standalone retrieval queries.

### 8. Why source tracking?

For traceability, debugging, citations, and user trust.

### 9. What is the difference between tool calling and RAG?

Tool calling is the mechanism that lets the agent invoke external functionality. RAG is one particular tool/workflow that retrieves relevant knowledge and supplies it to the model.

### 10. What is the production security concern with RAG?

Authorization must be enforced before retrieval so users cannot retrieve documents they are not allowed to access.
