import express from "express";
import dotenv from "dotenv";

import agentRoutes from "./routes/agentRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Day 57 AI Agent API is running.",
  });
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    service: "day57-agent",
    status: "healthy",
  });
});

app.use("/api/agent", agentRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Day 57 Agent API running on port ${PORT}`);

  console.log(`POST http://localhost:${PORT}/api/agent`);
});
