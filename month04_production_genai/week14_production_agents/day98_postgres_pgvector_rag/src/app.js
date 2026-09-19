import express from "express";
import { config } from "./config/config.js";
import { checkDatabase } from "./infrastructure/database/db.js";
import { DocumentRepository } from "./infrastructure/repositories/document.repository.js";
import { VectorRepository } from "./infrastructure/repositories/vector.repository.js";
import { EmbeddingService } from "./ai/embeddings/embedding.service.js";
import { LlmService } from "./ai/llm/llm.service.js";
import { Retriever } from "./ai/rag/retriever.js";
import { RagService } from "./ai/rag/rag.service.js";
import { IngestionQueue } from "./infrastructure/queue/ingestion.queue.js";
import { IngestionWorker } from "./ingestion/ingestion.worker.js";
import { DocumentService } from "./application/document.service.js";
import { ChatService } from "./application/chat.service.js";
import { createDocumentController } from "./api/controllers/document.controller.js";
import { createChatController } from "./api/controllers/chat.controller.js";
import { createDocumentRoutes } from "./api/routes/document.routes.js";
import { createChatRoutes } from "./api/routes/chat.routes.js";
import { auth } from "./api/middleware/auth.js";
import { errorHandler } from "./api/middleware/errorHandler.js";

const documentRepository = new DocumentRepository();
const vectorRepository = new VectorRepository();
const embeddingService = new EmbeddingService();
const llmService = new LlmService();

const retriever = new Retriever(vectorRepository, {
  topK: config.TOP_K,
  maxDistance: config.MAX_DISTANCE
});

const ragService = new RagService({
  embeddingService,
  retriever,
  llmService
});

const ingestionQueue = new IngestionQueue();

const ingestionWorker = new IngestionWorker({
  documentRepository,
  vectorRepository,
  embeddingService,
  maxRetries: config.MAX_RETRIES
});

ingestionQueue.setWorker(ingestionWorker);

const documentService = new DocumentService({
  documentRepository,
  vectorRepository,
  ingestionQueue
});

const chatService = new ChatService({
  ragService
});

const documentController = createDocumentController(documentService);
const chatController = createChatController(chatService);

const app = express();

app.use(express.json({ limit: "2mb" }));

app.get("/api/health", async (req, res) => {
  try {
    const database = await checkDatabase();

    res.json({
      status: "ok",
      database,
      model: config.GROQ_MODEL,
      embeddingModel: config.EMBEDDING_MODEL,
      embeddingDimension: config.EMBEDDING_DIMENSION
    });
  } catch (error) {
    res.status(503).json({
      status: "error",
      database: {
        connected: false,
        error: error.message
      }
    });
  }
});

app.use(
  "/api/documents",
  createDocumentRoutes(documentController, auth)
);

app.use(
  "/api/chat",
  createChatRoutes(chatController, auth)
);

app.use(errorHandler);

export { app };
