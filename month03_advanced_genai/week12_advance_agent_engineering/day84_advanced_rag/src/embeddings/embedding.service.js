function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export function createVocabulary(documents) {
  const vocabulary = new Set();

  for (const document of documents) {
    for (const token of tokenize(document.content)) {
      vocabulary.add(token);
    }
  }

  return [...vocabulary];
}

export function embedText(text, vocabulary) {
  const tokens = tokenize(text);

  const counts = {};

  for (const token of tokens) {
    counts[token] = (counts[token] || 0) + 1;
  }

  const vector = vocabulary.map((word) => {
    return counts[word] || 0;
  });

  const magnitude = Math.sqrt(
    vector.reduce((sum, value) => sum + value * value, 0),
  );

  if (magnitude === 0) {
    return vector;
  }

  return vector.map((value) => value / magnitude);
}

export function cosineSimilarity(a, b) {
  if (a.length !== b.length) {
    throw new Error("Vectors must have the same length");
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    magnitudeA += a[i] * a[i];
    magnitudeB += b[i] * b[i];
  }

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}
