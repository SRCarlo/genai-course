import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createDocumentVectors, createVector } from "./embedding.service.js";

import { cosineSimilarity } from "../utils/score.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "../..");

let vectorIndex = null;

async function loadDocuments() {
  const metadataPath = path.join(ROOT, "data", "metadata", "documents.json");

  const metadata = JSON.parse(await fs.readFile(metadataPath, "utf8"));

  const documents = [];

  for (const item of metadata) {
    const documentPath = path.join(ROOT, "data", "documents", item.filename);

    const content = await fs.readFile(documentPath, "utf8");

    documents.push({
      id: item.id,
      title: item.title,
      content,
      metadata: item.metadata,
    });
  }

  return documents;
}

export async function initializeVectorIndex() {
  const documents = await loadDocuments();

  vectorIndex = createDocumentVectors(documents);

  return vectorIndex;
}

function matchesMetadata(document, filters = {}) {
  if (!filters || Object.keys(filters).length === 0) {
    return true;
  }

  for (const [key, expectedValue] of Object.entries(filters)) {
    if (document.metadata?.[key] !== expectedValue) {
      return false;
    }
  }

  return true;
}

export async function vectorSearch(
  query,
  { topK = 10, metadataFilter = {} } = {},
) {
  if (!vectorIndex) {
    await initializeVectorIndex();
  }

  const candidates = vectorIndex.documents.filter((document) =>
    matchesMetadata(document, metadataFilter),
  );

  const queryVector = createVector(query, vectorIndex.vocabulary);

  return candidates
    .map((document) => ({
      ...document,
      score: cosineSimilarity(queryVector, document.vector),
      searchType: "vector",
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
