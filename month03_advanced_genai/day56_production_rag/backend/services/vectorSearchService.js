import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { createEmbedding } from "./embeddingService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VECTOR_STORE_PATH = path.resolve(
  __dirname,
  "../../data/vector-store.json",
);

function cosineSimilarity(a, b) {
  if (!a?.length || !b?.length || a.length !== b.length) {
    return 0;
  }

  let dot = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magnitudeA += a[i] * a[i];
    magnitudeB += b[i] * b[i];
  }

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dot / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}

async function loadVectorStore() {
  try {
    const raw = await fs.readFile(VECTOR_STORE_PATH, "utf-8");

    if (!raw.trim()) {
      return [];
    }

    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function vectorSearch(query, options = {}) {
  const topK = options.topK || Number(process.env.VECTOR_TOP_K || 8);

  const embedding = await createEmbedding(query);

  const documents = await loadVectorStore();

  const results = documents
    .map((doc) => ({
      ...doc,
      vectorScore: cosineSimilarity(embedding, doc.embedding),
    }))
    .sort((a, b) => b.vectorScore - a.vectorScore)
    .slice(0, topK);

  return results;
}
