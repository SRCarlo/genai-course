import "dotenv/config";
import express from "express";

import reactRoutes from "./routes/reactRoutes.js";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Day 61 ReAct Agent API",

    status: "running",

    model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
  });
});

app.use("/api", reactRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  res.status(500).json({
    error: error.message,
  });
});

app.listen(PORT, () => {
  console.log(`ReAct server running on http://localhost:${PORT}`);
});
