export function calculateAverage(values = []) {
  if (!values.length) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function calculateQualityScore(results = []) {
  if (!results.length) {
    return 0;
  }

  const total = results.reduce((sum, result) => {
    return sum + (result.score || 0);
  }, 0);

  return total / results.length;
}

export function calculateCost({ inputTokens = 0, outputTokens = 0 }) {
  // Current Groq GPT-OSS 20B pricing documented by Groq:
  // input: $0.075 / 1M tokens
  // output: $0.30 / 1M tokens
  //
  // Keep this isolated so pricing can be changed centrally.

  const inputCost = (inputTokens / 1_000_000) * 0.075;

  const outputCost = (outputTokens / 1_000_000) * 0.3;

  return inputCost + outputCost;
}

export function calculateOptimizationStatus({
  quality,
  latencyMs,
  costPerRequest,
}) {
  const minQuality = Number(process.env.MIN_QUALITY || 0.9);
  const maxLatency = Number(process.env.MAX_LATENCY_MS || 2000);
  const maxCost = Number(process.env.MAX_COST_PER_REQUEST || 0.005);

  const qualityPass = quality >= minQuality;
  const latencyPass = latencyMs <= maxLatency;
  const costPass = costPerRequest <= maxCost;

  return {
    qualityPass,
    latencyPass,
    costPass,
    accepted: qualityPass && latencyPass && costPass,
  };
}
