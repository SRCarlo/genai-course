import express from "express";
import { env } from "./config/env.js";
import agentRoutes from "./routes/agent.routes.js";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    success: true,
    service: "day77-tool-calling",
    model: env.groqModel,
  });
});

app.use("/api/agent", agentRoutes);

app.listen(env.port, () => {
  console.log(`Day 77 server running on http://localhost:${env.port}`);

  console.log(`Model: ${env.groqModel}`);
});
