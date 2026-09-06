export function formatEvaluationReport(
  report
) {
  return `
========================================
RAG EVALUATION REPORT
========================================

Questions
---------
Total:       ${report.totalQuestions}
Successful:  ${report.successfulQuestions}
Failed:      ${report.failedQuestions}

Retrieval
---------
Recall@3:    ${report.retrieval.recallAt3.toFixed(3)}
Recall@5:    ${report.retrieval.recallAt5.toFixed(3)}
Recall@10:   ${report.retrieval.recallAt10.toFixed(3)}

Precision@3: ${report.retrieval.precisionAt3.toFixed(3)}
Precision@5: ${report.retrieval.precisionAt5.toFixed(3)}

MRR:         ${report.retrieval.mrr.toFixed(3)}

Generation
----------
Context relevance:
             ${report.generation.contextRelevance.toFixed(3)}

Faithfulness:
             ${report.generation.faithfulness.toFixed(3)}

Correctness:
             ${report.generation.correctness.toFixed(3)}

Latency
-------
P50:         ${report.latency.p50} ms
P95:         ${report.latency.p95} ms
P99:         ${report.latency.p99} ms

Usage
-----
Avg input tokens:
             ${Math.round(report.usage.averageInputTokens)}

Avg output tokens:
             ${Math.round(report.usage.averageOutputTokens)}

Total cost:
             $${report.usage.totalCost.toFixed(6)}

========================================
`;
}