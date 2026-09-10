import "dotenv/config";

import express from "express";

import agentRoutes from "./routes/agent.routes.js";

const app = express();

app.use(
  express.json({
    limit: "1mb",
  }),
);

app.use("/api/agent", agentRoutes);

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "day89-secure-tool-runtime",
    model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: "ROUTE_NOT_FOUND",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Secure AI Tool Runtime running on port ${PORT}`);

  console.log(`Model: ${process.env.GROQ_MODEL || "openai/gpt-oss-20b"}`);

  console.log(
    `Groq API Key loaded: ${process.env.GROQ_API_KEY ? "YES" : "NO"}`,
  );
});
