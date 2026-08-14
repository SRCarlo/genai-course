import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createEmbedding } from "../embeddings/embeddingService.js";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const chunksPath = path.resolve(__dirname, "../../data/chunks/chunks.json");

let documents = null;

async function loadDocuments() {
  if (documents) {
    return documents;
  }

  const raw = await fs.readFile(chunksPath, "utf-8");

  const chunks = JSON.parse(raw);

  console.log(`Embedding ${chunks.length} knowledge chunks...`);

  for (const chunk of chunks) {
    chunk.embedding = await createEmbedding(`${chunk.title}\n${chunk.content}`);
  }

  documents = chunks;

  console.log("Knowledge base loaded.");

  return documents;
}

function cosineSimilarity(vectorA, vectorB) {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    dot += vectorA[i] * vectorB[i];

    normA += vectorA[i] * vectorA[i];

    normB += vectorB[i] * vectorB[i];
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function search(queryEmbedding, topK = 5) {
  const items = await loadDocuments();

  const scored = items.map((item) => ({
    ...item,

    score: cosineSimilarity(queryEmbedding, item.embedding),
  }));

  return scored.sort((a, b) => b.score - a.score).slice(0, topK);
}

export async function searchByText(query, topK = 5) {
  const embedding = await createEmbedding(query);

  return search(embedding, topK);
}

export async function getAllDocuments() {
  return loadDocuments();
}
