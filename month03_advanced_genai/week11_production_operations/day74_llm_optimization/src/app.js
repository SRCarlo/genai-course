import express from "express";
import dotenv from "dotenv";

import optimizationRoutes from "./routes/optimization.routes.js";

dotenv.config();

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "day74-llm-optimization",
    model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
  });
});

app.use("/api/optimization", optimizationRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    error: "Internal server error",
    message: err.message,
  });
});

export default app;
