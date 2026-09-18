import express from "express";

import { config } from "./config/config.js";

import { EmbeddingService } from "./ai/embeddings/embedding.service.js";

import { LLMService } from "./ai/llm/llm.service.js";

import { Retriever } from "./ai/rag/retriever.js";

import { RagService } from "./ai/rag/rag.service.js";

import { VectorRepository } from "./infrastructure/vector/vector.repository.js";

import { DocumentRepository } from "./infrastructure/database/document.repository.js";

import { DocumentService } from "./application/document.service.js";

import { ChatService } from "./application/chat.service.js";

import { createChatRouter } from "./api/routes/chat.routes.js";

import { createDocumentRouter } from "./api/routes/document.routes.js";

import { errorHandler } from "./api/middleware/errorHandler.js";

const app = express();

app.use(
  express.json({
    limit: "1mb",
  }),
);

const embeddingService = new EmbeddingService();

const vectorRepository = new VectorRepository();

const documentRepository = new DocumentRepository();

const llmService = new LLMService();

const retriever = new Retriever(vectorRepository);

const ragService = new RagService({
  embeddingService,

  retriever,

  llmService,

  topK: config.topK,

  threshold: config.similarityThreshold,
});

const chatService = new ChatService(ragService);

const documentService = new DocumentService({
  documentRepository,

  embeddingService,

  vectorRepository,
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

app.use("/api", createChatRouter(chatService));

app.use("/api", createDocumentRouter(documentService));

app.use(errorHandler);

export default app;
