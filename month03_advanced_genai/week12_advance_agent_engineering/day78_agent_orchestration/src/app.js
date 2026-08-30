import express from "express";

import agentRoutes from "./routes/agent.routes.js";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    success: true,
    service: "day78-agent",
    status: "healthy",
  });
});

app.use("/api/agent", agentRoutes);

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

export default app;
