import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  addDocuments,
  clearVectorStore,
  similaritySearch,
} from "../vectorstore/vectorStore.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const documentsDirectory = path.join(__dirname, "../data/documents");

let initialized = false;

function chunkText(text, chunkSize = 500, overlap = 100) {
  const words = text.split(/\s+/).filter(Boolean);
  const chunks = [];

  let start = 0;
  let chunkNumber = 1;

  while (start < words.length) {
    const end = Math.min(start + chunkSize, words.length);

    const content = words.slice(start, end).join(" ");

    chunks.push({
      content,
      chunkNumber,
    });

    if (end === words.length) {
      break;
    }

    start = end - overlap;
    chunkNumber++;
  }

  return chunks;
}

async function loadDocuments() {
  const files = await fs.readdir(documentsDirectory);

  const allChunks = [];

  for (const file of files) {
    if (!file.endsWith(".txt")) {
      continue;
    }

    const filePath = path.join(documentsDirectory, file);

    const content = await fs.readFile(filePath, "utf8");

    const chunks = chunkText(content);

    for (const chunk of chunks) {
      const baseName = path.basename(file, ".txt");

      allChunks.push({
        content: chunk.content,
        source: file,
        chunkId: `${baseName}-${chunk.chunkNumber}`,
        chunkNumber: chunk.chunkNumber,
      });
    }
  }

  return allChunks;
}

export async function initializeRetriever() {
  if (initialized) {
    return;
  }

  clearVectorStore();

  const chunks = await loadDocuments();

  addDocuments(chunks);

  initialized = true;

  console.log(`RAG initialized with ${chunks.length} chunks`);
}

export async function retrieveDocuments(query, topK = 5) {
  await initializeRetriever();

  const results = similaritySearch(query, topK);

  const MIN_SCORE = 0.12;

  return results
    .filter((result) => result.score >= MIN_SCORE)
    .map((result) => ({
      content: result.content,
      source: result.source,
      chunkId: result.chunkId,
      score: Number(result.score.toFixed(4)),
    }));
}
