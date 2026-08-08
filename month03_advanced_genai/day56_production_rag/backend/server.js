import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import chatRoutes from "./routes/chatRoutes.js";
import { requestId } from "./middleware/requestId.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json({ limit: "1mb" }));

app.use(requestId);

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Production RAG API is running",
    requestId: req.requestId,
    ollama: process.env.OLLAMA_BASE_URL,
  });
});

app.use("/api/chat", chatRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    requestId: req.requestId,
  });
});

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`Production RAG API running on http://localhost:${PORT}`);
});
