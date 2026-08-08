# Day 56 RAG Evaluation Report

## Dataset

Number of evaluation questions:

12

## Metrics

The following metrics are calculated from the evaluation dataset:

- Hit@5
- Recall@5
- MRR
- Average retrieval/reranking latency

## Results

Results are generated automatically in:

evaluation/results.json

## Interpretation

### Hit@5

Measures whether at least one expected source appears within the top five retrieved results.

### Recall@5

Measures how many of the expected source documents appear within the top five results.

### MRR

Measures how highly the first relevant source appears in the ranking.

### Latency

Measures the total time required for retrieval and reranking during evaluation.

## Notes

This project uses a local JSON vector store for learning purposes.

Embeddings are generated using:

nomic-embed-text

Answer generation and local reranking use:

llama3.2:3b

For a larger production deployment, the vector store should be replaced with a dedicated vector database and the LLM-based reranker should be replaced with a dedicated reranking model where appropriate.
