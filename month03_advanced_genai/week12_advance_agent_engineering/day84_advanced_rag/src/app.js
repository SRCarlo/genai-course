import express from "express";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import path from "path";
import { fileURLToPath } from "url";

import { ingestDocuments } from "./ingestion/ingestion.pipeline.js";

import { createRagRouter } from "./routes/rag.routes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

if (!process.env.GROQ_API_KEY) {
  console.error("GROQ_API_KEY is missing.");

  process.exit(1);
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const documentsPath = path.join(__dirname, "../documents");

const { vocabulary, documents } = await ingestDocuments(documentsPath);

console.log(`Loaded ${documents.length} chunks`);

app.get("/", (req, res) => {
  res.json({
    message: "Day 84 Production RAG API",
    model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    chunks: documents.length,
  });
});

app.use(
  "/api/rag",
  createRagRouter({
    groq,
    vocabulary,
  }),
);

app.listen(PORT, () => {
  console.log(`RAG API running on http://localhost:${PORT}`);
});
