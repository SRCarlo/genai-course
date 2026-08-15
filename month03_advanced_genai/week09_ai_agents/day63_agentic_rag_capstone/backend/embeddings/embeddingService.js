const DIMENSIONS = 256;

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}%]+/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function hashToken(token) {
  let hash = 2166136261;

  for (let i = 0; i < token.length; i++) {
    hash ^= token.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return Math.abs(hash) % DIMENSIONS;
}

function normalize(vector) {
  const magnitude = Math.sqrt(
    vector.reduce((sum, value) => sum + value * value, 0),
  );

  if (magnitude === 0) {
    return vector;
  }

  return vector.map((value) => value / magnitude);
}

export function embedText(text) {
  const vector = new Array(DIMENSIONS).fill(0);
  const tokens = tokenize(text);

  for (const token of tokens) {
    const index = hashToken(token);
    vector[index] += 1;
  }

  return normalize(vector);
}

export function cosineSimilarity(a, b) {
  if (!a || !b || a.length !== b.length) {
    return 0;
  }

  return a.reduce((sum, value, index) => sum + value * b[index], 0);
}
