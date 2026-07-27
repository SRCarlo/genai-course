import { createEmbedding } from "./embeddings.js";

const memories = [];

export function storeMemory(text) {
  const embedding = createEmbedding(text);

  memories.push({
    text,

    embedding,
  });
}

export function searchMemory(query) {
  const queryVector = createEmbedding(query);

  let result = null;

  let highestScore = 0;

  for (const memory of memories) {
    const score = similarity(queryVector, memory.embedding);

    if (score > highestScore) {
      highestScore = score;

      result = memory.text;
    }
  }

  return result;
}

function similarity(vector1, vector2) {
  let score = 0;

  const length = Math.min(vector1.length, vector2.length);

  for (let i = 0; i < length; i++) {
    score += 1 - Math.abs(vector1[i] - vector2[i]) / 255;
  }

  return score;
}
