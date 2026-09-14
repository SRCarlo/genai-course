# Day 93 — Agent Evaluation

## 1. Why Agent Evaluation Matters
Measure correctness, reliability, safety, grounding, consistency, efficiency, latency and cost.

## 2. Evaluation Datasets
Use representative normal, difficult, edge, ambiguous, malicious and failure cases.

## 3. Golden Datasets
A stable trusted benchmark for regression testing.

## 4. Evaluation Categories
Correctness, tool usage, grounding, format, safety, latency, cost and robustness.

## 5. Exact Match
Useful for deterministic values but weak for open-ended natural language.

## 6. Rule-Based Evaluation
Use deterministic checks whenever possible.

## 7. Structured Output Evaluation
Parse and validate required fields/schema.

## 8. Tool-Call Evaluation
Check tool selection, arguments, order, permissions and unnecessary calls.

## 9. Agent Trajectory
Evaluate the complete sequence of decisions and tool calls.

## 10. LLM-as-a-Judge
Use an LLM to score correctness, relevance, completeness and groundedness.

## 11. Human Evaluation
Use humans for difficult or high-impact cases.

## 12. RAG Evaluation
Evaluate retrieval and generation separately.

## 13. Retrieval Evaluation
Use Recall@K, Precision@K and MRR where appropriate.

## 14. Recall@K
Measure whether relevant information appears in the top K.

## 15. Hallucination Evaluation
Check whether claims are supported by available evidence.

## 16. Groundedness
Measure support of claims by evidence.

## 17. Citation Evaluation
Check existence, relevance and support of citations.

## 18. Completeness
Check required information is present.

## 19. Relevance
Check the answer addresses the actual request.

## 20. Safety Evaluation
Test unauthorized actions, private data access and instruction manipulation.

## 21. Prompt Injection Testing
Verify controlled and safe behavior.

## 22. Regression Testing
Run a stable dataset after changes.

## 23. Evaluation Thresholds
Use per-metric deployment gates.

## 24. Cost and Latency Evaluation
Track tokens, model calls, tool calls, latency and estimated cost.

## 25. Multi-Agent Evaluation
Measure routing, handoffs, agent execution, tools and final synthesis.

## 26. CI/CD Evaluation
Run the evaluation suite before deployment.

## 27. Dataset Versioning
Version datasets so baselines remain comparable.

## 28. Production Failure → Regression Test
Convert anonymized production failures into permanent test cases.

## 29. Agent Evaluation Framework
Agent → runner → dataset → evaluators → metrics → thresholds → report.

## 30. Interview Questions & Answers
Know why exact matching is insufficient, what LLM-as-a-Judge is, what trajectory evaluation means, and why evaluation belongs in CI/CD.
