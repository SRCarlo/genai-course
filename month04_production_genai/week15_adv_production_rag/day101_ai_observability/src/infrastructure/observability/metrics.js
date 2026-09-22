const counters = {
  requests: 0,
  errors: 0,
  llmRequests: 0,
  retrievalRequests: 0,
  rerankingRequests: 0,
};
const tokenMetrics = {
  inputTokens: 0,
  outputTokens: 0,
  totalTokens: 0,
  contextTokens: 0,
};
const latencyMetrics = { request: [], retrieval: [], reranking: [], llm: [] };
const qualityMetrics = { faithfulness: [], answerRelevance: [], recallAt5: [] };
let estimatedCost = 0;

export function increment(metric) {
  if (metric in counters) counters[metric]++;
}
export function recordTokens({
  inputTokens = 0,
  outputTokens = 0,
  totalTokens = inputTokens + outputTokens,
  contextTokens = 0,
}) {
  tokenMetrics.inputTokens += inputTokens;
  tokenMetrics.outputTokens += outputTokens;
  tokenMetrics.totalTokens += totalTokens;
  tokenMetrics.contextTokens += contextTokens;
}
export function recordLatency(type, latencyMs) {
  if (!(type in latencyMetrics)) return;
  latencyMetrics[type].push(Number(latencyMs));
  if (latencyMetrics[type].length > 1000) latencyMetrics[type].shift();
}
export function recordQuality({ faithfulness, answerRelevance, recallAt5 }) {
  if (typeof faithfulness === "number")
    qualityMetrics.faithfulness.push(faithfulness);
  if (typeof answerRelevance === "number")
    qualityMetrics.answerRelevance.push(answerRelevance);
  if (typeof recallAt5 === "number") qualityMetrics.recallAt5.push(recallAt5);
}
export function recordCost(cost) {
  estimatedCost += Number(cost) || 0;
}
function avg(values) {
  return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
}
function percentile(values, p) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil(p * sorted.length) - 1;
  return Number(sorted[Math.max(index, 0)].toFixed(2));
}
export function getMetrics() {
  const errorRate =
    counters.requests === 0 ? 0 : counters.errors / counters.requests;
  return {
    ...counters,
    errorRate,
    inputTokens: tokenMetrics.inputTokens,
    outputTokens: tokenMetrics.outputTokens,
    totalTokens: tokenMetrics.totalTokens,
    contextTokens: tokenMetrics.contextTokens,
    estimatedCost: Number(estimatedCost.toFixed(6)),
    avgRequestLatencyMs: Number(avg(latencyMetrics.request).toFixed(2)),
    p95LatencyMs: percentile(latencyMetrics.request, 0.95),
    retrievalLatencyMs: Number(avg(latencyMetrics.retrieval).toFixed(2)),
    rerankingLatencyMs: Number(avg(latencyMetrics.reranking).toFixed(2)),
    llmLatencyMs: Number(avg(latencyMetrics.llm).toFixed(2)),
    faithfulness: Number(avg(qualityMetrics.faithfulness).toFixed(4)),
    answerRelevance: Number(avg(qualityMetrics.answerRelevance).toFixed(4)),
    recallAt5: Number(avg(qualityMetrics.recallAt5).toFixed(4)),
  };
}
export function resetMetrics() {
  Object.keys(counters).forEach((k) => (counters[k] = 0));
  Object.keys(tokenMetrics).forEach((k) => (tokenMetrics[k] = 0));
  Object.keys(latencyMetrics).forEach((k) => (latencyMetrics[k] = []));
  Object.keys(qualityMetrics).forEach((k) => (qualityMetrics[k] = []));
  estimatedCost = 0;
}
