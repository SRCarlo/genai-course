import express from "express";

import agentRoutes from "./routes/agent.routes.js";

const app = express();

app.use(
  express.json({
    limit: "1mb",
  }),
);

app.get("/", (req, res) => {
  res.json({
    service: "Day 80 Multi-Agent System",

    model: "openai/gpt-oss-20b",

    provider: "Groq",
  });
});

app.use("/api/agent", agentRoutes);

export default app;
