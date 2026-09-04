import express from "express";

import { EmbeddingService } from "./embeddings/embedding.service.js";

import { VectorMemoryStore } from "./storage/vector.memory.store.js";

import { VectorMemoryManager } from "./memory/vector.memory.manager.js";

import { SemanticRetriever } from "./memory/semantic.retriever.js";

import { MemoryDeduplicator } from "./memory/memory.deduplicator.js";

import { GroqService } from "./services/groq.service.js";

import { MemoryAgent } from "./agents/memory.agent.js";

import { createChatRouter } from "./routes/chat.routes.js";

const app = express();

app.use(express.json());

// Services
const embeddingService = new EmbeddingService(128);

const vectorStore = new VectorMemoryStore();

const memoryManager = new VectorMemoryManager(embeddingService, vectorStore);

const retriever = new SemanticRetriever(embeddingService, vectorStore);

const deduplicator = new MemoryDeduplicator(
  embeddingService,
  vectorStore,
  0.92,
);

const groqService = new GroqService();

const memoryAgent = new MemoryAgent({
  groqService,
  retriever,
  memoryManager,
  deduplicator,
});

// Routes
app.use("/api", createChatRouter(memoryAgent));

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
  });
});

export { app, vectorStore, memoryManager, retriever, memoryAgent };
