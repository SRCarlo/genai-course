export function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

export function weightedScore({
  correctness = 0,
  relevance = 0,
  faithfulness = 0,
}) {
  const correctnessWeight = Number(process.env.CORRECTNESS_WEIGHT || 0.4);

  const relevanceWeight = Number(process.env.RELEVANCE_WEIGHT || 0.3);

  const faithfulnessWeight = Number(process.env.FAITHFULNESS_WEIGHT || 0.3);

  const safeCorrectness = clamp(Number(correctness));

  const safeRelevance = clamp(Number(relevance));

  const safeFaithfulness = clamp(Number(faithfulness));

  const score =
    safeCorrectness * correctnessWeight +
    safeRelevance * relevanceWeight +
    safeFaithfulness * faithfulnessWeight;

  return Number(clamp(score).toFixed(4));
}
