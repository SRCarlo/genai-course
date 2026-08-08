import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { createEmbedding } from "../backend/services/embeddingService.js";
import { tokenize } from "../backend/services/queryService.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCUMENTS_DIR = path.resolve(__dirname, "../data/documents");

const VECTOR_STORE_PATH = path.resolve(__dirname, "../data/vector-store.json");

function chunkText(text, chunkSize = 800, overlap = 100) {
  const words = text.split(/\s+/);

  const chunks = [];

  let start = 0;

  while (start < words.length) {
    const end = Math.min(start + chunkSize, words.length);

    const chunk = words.slice(start, end).join(" ").trim();

    if (chunk) {
      chunks.push(chunk);
    }

    if (end === words.length) {
      break;
    }

    start = end - overlap;
  }

  return chunks;
}

function getCategory(filename) {
  if (
    filename.includes("express") ||
    filename.includes("middleware") ||
    filename.includes("routing")
  ) {
    return "express";
  }

  if (filename.includes("node")) {
    return "nodejs";
  }

  if (filename.includes("mongo")) {
    return "database";
  }

  if (filename.includes("api") || filename.includes("rest")) {
    return "api";
  }

  return "javascript";
}

async function ingest() {
  console.log("Starting ingestion...");

  const files = (await fs.readdir(DOCUMENTS_DIR)).filter((file) =>
    file.endsWith(".md"),
  );

  const records = [];

  for (const file of files) {
    console.log(`\nProcessing ${file}`);

    const filePath = path.join(DOCUMENTS_DIR, file);

    const text = await fs.readFile(filePath, "utf-8");

    const chunks = chunkText(text);

    console.log(`Created ${chunks.length} chunks`);

    for (let index = 0; index < chunks.length; index++) {
      const chunk = chunks[index];

      console.log(`Embedding chunk ${index + 1}/${chunks.length}`);

      const embedding = await createEmbedding(chunk);

      records.push({
        id: crypto
          .createHash("sha256")
          .update(`${file}-${index}-${chunk}`)
          .digest("hex")
          .slice(0, 16),

        source: file,

        category: getCategory(file),

        chunkIndex: index,

        text: chunk,

        tokens: tokenize(chunk),

        embedding,
      });
    }
  }

  await fs.writeFile(VECTOR_STORE_PATH, JSON.stringify(records, null, 2));

  console.log(`\nIngestion complete.`);

  console.log(`Stored ${records.length} chunks.`);
}

ingest().catch((error) => {
  console.error("Ingestion failed:", error);

  process.exit(1);
});
