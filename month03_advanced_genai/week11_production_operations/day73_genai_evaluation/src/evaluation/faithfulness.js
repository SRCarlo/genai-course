import { normalizeText } from "./correctness.js";

export function faithfulnessScore(answer, context) {
  if (!context) {
    return 1;
  }

  const answerWords = normalizeText(answer)
    .split(" ")
    .filter((word) => word.length > 3);

  const contextWords = new Set(
    normalizeText(context)
      .split(" ")
      .filter((word) => word.length > 3),
  );

  if (answerWords.length === 0) {
    return 0;
  }

  let supported = 0;

  for (const word of answerWords) {
    if (contextWords.has(word)) {
      supported++;
    }
  }

  return Number((supported / answerWords.length).toFixed(4));
}
