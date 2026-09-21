export const thresholds = {
  recallAt5: 0.85,
  precisionAt5: 0.7,
  faithfulness: 0.9,
  answerRelevance: 0.85,
};

export function passesThreshold(actual, threshold) {
  return actual >= threshold;
}
