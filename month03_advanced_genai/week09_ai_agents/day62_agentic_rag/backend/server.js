import "dotenv/config";

import express from "express";

import agentRoutes from "./routes/agentRoutes.js";

const app = express();

const PORT = Number(process.env.PORT || 3000);

app.use(
  express.json({
    limit: "1mb",
  }),
);

app.get("/", (req, res) => {
  res.json({
    name: "Day 62 - Agentic RAG API",
    status: "running",
  });
});

app.use("/api", agentRoutes);

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    error: "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`Agentic RAG server running on port ${PORT}`);
});
