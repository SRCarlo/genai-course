export function tokenize(text = "") {
  return text
    .toLowerCase()
    .replace(/[^\w.-]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export function termFrequency(tokens) {
  const frequencies = new Map();

  for (const token of tokens) {
    frequencies.set(token, (frequencies.get(token) || 0) + 1);
  }

  return frequencies;
}

export function cosineSimilarity(a, b) {
  if (!a.length || !b.length) {
    return 0;
  }

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
  }

  for (let i = 0; i < b.length; i++) {
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function normalizeScores(documents) {
  if (!documents.length) {
    return [];
  }

  const scores = documents.map((doc) => doc.score ?? 0);

  const min = Math.min(...scores);
  const max = Math.max(...scores);

  if (min === max) {
    return documents.map((doc) => ({
      ...doc,
      normalizedScore: 1,
    }));
  }

  return documents.map((doc) => ({
    ...doc,
    normalizedScore: (doc.score - min) / (max - min),
  }));
}

export function estimateTokens(text = "") {
  return Math.ceil(text.length / 4);
}
