import { tokenize } from "./tokenizer.js";

function termFrequency(tokens) {
  const map = new Map();
  for (const token of tokens) {
    map.set(token, (map.get(token) ?? 0) + 1);
  }
  return map;
}

function cosine(a, b) {
  const keys = new Set([...a.keys(), ...b.keys()]);
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (const key of keys) {
    const av = a.get(key) ?? 0;
    const bv = b.get(key) ?? 0;
    dot += av * bv;
    normA += av * av;
    normB += bv * bv;
  }

  if (!normA || !normB) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function buildTfidf(documents) {
  const tokenized = documents.map((doc) => tokenize(doc.text));
  const documentFrequency = new Map();

  for (const tokens of tokenized) {
    for (const token of new Set(tokens)) {
      documentFrequency.set(token, (documentFrequency.get(token) ?? 0) + 1);
    }
  }

  const n = documents.length;

  function vectorFor(tokens) {
    const tf = termFrequency(tokens);
    const vector = new Map();

    for (const [token, count] of tf) {
      const df = documentFrequency.get(token) ?? 0;
      const idf = Math.log((n + 1) / (df + 1)) + 1;
      vector.set(token, count * idf);
    }

    return vector;
  }

  return {
    vectorFor,
    vectors: tokenized.map(vectorFor),
  };
}

export function vectorSearch(query, documents, topK = 5) {
  const index = buildTfidf(documents);
  const queryVector = index.vectorFor(tokenize(query));

  return documents
    .map((document, i) => ({
      ...document,
      score: cosine(queryVector, index.vectors[i]),
      source: "vector",
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
