import { normalizeText } from "./correctness.js";

function frequencyVector(text) {
  const words = normalizeText(text).split(" ").filter(Boolean);

  const vector = {};

  for (const word of words) {
    vector[word] = (vector[word] || 0) + 1;
  }

  return vector;
}

function dotProduct(a, b) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);

  let result = 0;

  for (const key of keys) {
    result += (a[key] || 0) * (b[key] || 0);
  }

  return result;
}

function magnitude(vector) {
  return Math.sqrt(
    Object.values(vector).reduce((sum, value) => sum + value * value, 0),
  );
}

export function semanticSimilarity(actual, expected) {
  const actualVector = frequencyVector(actual);

  const expectedVector = frequencyVector(expected);

  const denominator = magnitude(actualVector) * magnitude(expectedVector);

  if (denominator === 0) {
    return 0;
  }

  const similarity = dotProduct(actualVector, expectedVector) / denominator;

  return Number(similarity.toFixed(4));
}
