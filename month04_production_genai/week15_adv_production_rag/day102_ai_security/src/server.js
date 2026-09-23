import "dotenv/config";
import express from "express";
import askRouter from "./api/routes/ask.js";

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json({ limit: "100kb" }));

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "day102-ai-security",
    model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
  });
});

app.use("/api", askRouter);

app.use((error, _req, res, _next) => {
  console.error(error);

  res.status(500).json({
    error: "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`Day 102 server running on http://localhost:${PORT}`);
});
