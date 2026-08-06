export function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);
}

export function createVector(text) {
  const words = tokenize(text);

  const map = {};

  words.forEach((word) => {
    map[word] = (map[word] || 0) + 1;
  });

  return map;
}

export function cosineSimilarity(vec1, vec2) {
  let dot = 0;

  let magA = 0;

  let magB = 0;

  const words = new Set([...Object.keys(vec1), ...Object.keys(vec2)]);

  words.forEach((word) => {
    const a = vec1[word] || 0;

    const b = vec2[word] || 0;

    dot += a * b;

    magA += a * a;

    magB += b * b;
  });

  if (magA === 0 || magB === 0) return 0;

  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}
