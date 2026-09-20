// Day 99 uses a deterministic local embedding mock because the assignment calls for mock retrieval data.
// Groq GPT-OSS 20B is used for LLM operations, not embeddings.
const DIMENSIONS = 64;
function hashToken(token) {
  let hash = 2166136261;
  for (let i = 0; i < token.length; i++) {
    hash ^= token.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}
export function tokenize(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9_./:-]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}
export function createEmbedding(text) {
  const vector = Array(DIMENSIONS).fill(0);
  for (const token of tokenize(text))
    vector[hashToken(token) % DIMENSIONS] += 1;
  const magnitude = Math.sqrt(vector.reduce((s, v) => s + v * v, 0));
  return magnitude ? vector.map((v) => v / magnitude) : vector;
}
export function cosineSimilarity(a, b) {
  if (!a?.length || !b?.length || a.length !== b.length) return 0;
  return a.reduce((s, v, i) => s + v * b[i], 0);
}
