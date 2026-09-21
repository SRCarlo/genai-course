import express from "express";
import dotenv from "dotenv";
import chatRoutes from "./api/routes/chat.routes.js";
import { createRequestId } from "./infrastructure/observability/request-id.js";
import { errorHandler } from "./api/middleware/errorHandler.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.requestId = createRequestId();
  res.setHeader("x-request-id", req.requestId);
  next();
});

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "day100-rag-evaluation",
    model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
  });
});

app.use("/api/chat", chatRoutes);

app.use(errorHandler);

export default app;
