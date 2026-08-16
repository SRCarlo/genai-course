export function calculateAverage(values = []) {
  if (!values.length) {
    return 0;
  }

  return (
    values.reduce((sum, value) => sum + Number(value || 0), 0) / values.length
  );
}

export function percentile(values = [], percentileValue = 50) {
  if (!values.length) {
    return 0;
  }

  const sorted = [...values].map(Number).sort((a, b) => a - b);

  const index = (percentileValue / 100) * (sorted.length - 1);

  const lower = Math.floor(index);
  const upper = Math.ceil(index);

  if (lower === upper) {
    return sorted[lower];
  }

  const weight = index - lower;

  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

export function calculateMetrics(results = []) {
  const latencyValues = results
    .map((result) => result.latencyMs)
    .filter((value) => typeof value === "number");

  const tokenValues = results
    .map((result) => result.usage?.totalTokens)
    .filter((value) => typeof value === "number");

  return {
    correctness: calculateAverage(
      results.map((r) => r.answerEvaluation?.correctness ?? 0),
    ),

    relevance: calculateAverage(
      results.map((r) => r.answerEvaluation?.relevance ?? 0),
    ),

    faithfulness: calculateAverage(
      results.map((r) => r.answerEvaluation?.faithfulness ?? 0),
    ),

    retrievalPrecision: calculateAverage(
      results.map((r) => r.retrievalEvaluation?.precision ?? 0),
    ),

    retrievalRecall: calculateAverage(
      results.map((r) => r.retrievalEvaluation?.recall ?? 0),
    ),

    reciprocalRank: calculateAverage(
      results.map((r) => r.retrievalEvaluation?.reciprocalRank ?? 0),
    ),

    top1: calculateAverage(results.map((r) => r.topK?.top1 ?? 0)),

    top3: calculateAverage(results.map((r) => r.topK?.top3 ?? 0)),

    top5: calculateAverage(results.map((r) => r.topK?.top5 ?? 0)),

    toolSelectionAccuracy: calculateAverage(
      results.map((r) => r.agentEvaluation?.toolSelectionCorrect ?? 0),
    ),

    trajectoryAccuracy: calculateAverage(
      results.map((r) => r.agentEvaluation?.trajectoryCorrect ?? 0),
    ),

    toolEfficiency: calculateAverage(
      results.map((r) => r.agentEvaluation?.toolEfficiency ?? 0),
    ),

    averageLatencyMs: calculateAverage(latencyValues),

    p50LatencyMs: percentile(latencyValues, 50),

    p95LatencyMs: percentile(latencyValues, 95),

    maxLatencyMs: latencyValues.length ? Math.max(...latencyValues) : 0,

    averageTotalTokens: calculateAverage(tokenValues),

    totalLLMCalls: results.reduce(
      (sum, result) => sum + Number(result.usage?.llmCalls || 0),
      0,
    ),

    totalToolCalls: results.reduce(
      (sum, result) =>
        sum + Number(result.agentEvaluation?.actualTools?.length || 0),
      0,
    ),
  };
}
