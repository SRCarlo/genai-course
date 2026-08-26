import { calculateAverage, calculateQualityScore } from "../utils/metrics.js";

export function evaluateOutput({ output, expected }) {
  const normalizedOutput = output.toLowerCase();

  const normalizedExpected = expected.toLowerCase();

  if (normalizedOutput.trim() === normalizedExpected.trim()) {
    return 1;
  }

  const expectedWords = normalizedExpected.split(/\s+/);

  const matched = expectedWords.filter((word) =>
    normalizedOutput.includes(word),
  );

  return matched.length / expectedWords.length;
}

export function evaluateBatch(results) {
  const scores = results.map((result) =>
    evaluateOutput({
      output: result.output,
      expected: result.expected,
    }),
  );

  return {
    quality: calculateQualityScore(scores.map((score) => ({ score }))),
    averageLatency: calculateAverage(results.map((result) => result.latencyMs)),
    averageCost: calculateAverage(
      results.map((result) => result.costPerRequest),
    ),
  };
}
