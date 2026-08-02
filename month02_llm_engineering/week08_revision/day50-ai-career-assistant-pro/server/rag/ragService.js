import Vector from "../models/Vector.js";

import { createEmbedding } from "./embeddingService.js";

const cosineSimilarity = (a, b) => {
  let dot = 0;

  let normA = 0;

  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];

    normA += a[i] * a[i];

    normB += b[i] * b[i];
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
};

export const retrieveContext = async (question) => {
  const queryEmbedding = await createEmbedding(question);

  const vectors = await Vector.find();

  const ranked = vectors
    .map((item) => ({
      text: item.text,

      score: cosineSimilarity(queryEmbedding, item.embedding),
    }))
    .sort((a, b) => b.score - a.score);

  return ranked
    .slice(0, 5)
    .map((item) => item.text)
    .join("\n");
};
