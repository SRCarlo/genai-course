import { normalizeText } from "./correctness.js";

function tokenize(text) {
  return new Set(
    normalizeText(text)
      .split(" ")
      .filter((word) => word.length > 2),
  );
}

export function relevanceScore(question, answer) {
  const questionWords = tokenize(question);

  const answerWords = tokenize(answer);

  if (questionWords.size === 0) {
    return 0;
  }

  let matches = 0;

  for (const word of questionWords) {
    if (answerWords.has(word)) {
      matches++;
    }
  }

  return Number((matches / questionWords.size).toFixed(4));
}
