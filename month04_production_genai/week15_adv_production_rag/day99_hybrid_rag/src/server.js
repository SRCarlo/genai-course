import "dotenv/config";
import express from "express";
import chatRoutes from "./api/routes/chat.routes.js";
import { errorHandler } from "./api/middleware/errorHandler.js";

const app = express();

app.use(express.json({ limit: "1mb" }));

app.get("/health", (req, res) =>
  res.json({
    success: true,
    service: "day99-hybrid-rag",
    model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
  }),
);

app.use("/api/chat", chatRoutes);

app.use(errorHandler);

const PORT = Number(process.env.PORT || 5000);

app.listen(PORT, () =>
  console.log(`Day 99 Hybrid RAG running on http://localhost:${PORT}`),
);
