import "dotenv/config";

import express from "express";

import agentRoutes from "./routes/agentRoutes.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",

    service: "day60-planning-agent",

    llm: "Groq",
  });
});

app.use("/api", agentRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  res.status(500).json({
    error: "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`Day 60 Planning Agent running on port ${PORT}`);

  console.log(`LLM Provider: Groq`);

  console.log(`Model: ${process.env.GROQ_MODEL || "llama-3.3-70b-versatile"}`);
});
