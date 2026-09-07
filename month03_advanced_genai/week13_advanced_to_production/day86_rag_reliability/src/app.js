import "dotenv/config";

import express from "express";

import ragRoutes from "./routes/rag.routes.js";

import { logger } from "./observability/logger.js";

import { getMetrics } from "./observability/metrics.js";

const app = express();

const PORT = Number(process.env.PORT || 5000);

app.disable("x-powered-by");

app.use(
  express.json({
    limit: "50kb",
  }),
);

app.get("/", (req, res) => {
  res.json({
    status: "success",

    service: "Day 86 RAG Reliability Gateway",

    provider: "Groq",

    model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",

    provider: "Groq",

    model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
  });
});

app.get("/metrics", (req, res) => {
  res.json(getMetrics());
});

app.use("/api/rag", ragRoutes);

app.use((error, req, res, next) => {
  logger.error("unhandled_error", {
    requestId: res.getHeader("X-Request-ID"),

    error: error.message,
  });

  const statusCode = Number(error.statusCode) || 500;

  res.status(statusCode).json({
    error: {
      code: error.code || "INTERNAL_ERROR",

      message:
        statusCode >= 500
          ? "Something went wrong while processing the request."
          : error.message,
    },
  });
});

app.listen(PORT, () => {
  logger.info("server_started", {
    port: PORT,

    provider: "Groq",

    model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
  });

  console.log(`🚀 Day 86 RAG Reliability Gateway running on port ${PORT}`);
});
