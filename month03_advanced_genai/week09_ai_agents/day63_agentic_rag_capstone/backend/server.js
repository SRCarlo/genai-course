import express from "express";
import dotenv from "dotenv";

import agentRoutes from "./routes/agentRoutes.js";

import { errorHandler } from "./middleware/errorHandler.js";

import { initializeRetriever } from "./rag/retriever.js";

dotenv.config();

const app = express();

app.use(
  express.json({
    limit: "100kb",
  }),
);

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "agentic-rag",
    model: process.env.MODEL_NAME || "openai/gpt-oss-20b",
  });
});

app.use("/api", agentRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await initializeRetriever();

    app.listen(PORT, () => {
      console.log(`Agentic RAG server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);

    process.exit(1);
  }
}

startServer();
