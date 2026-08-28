import express from "express";
import agentRoutes from "./routes/agent.routes.js";

const app = express();

app.use(
  express.json({
    limit: "100kb",
  }),
);

app.get("/health", (req, res) => {
  res.json({
    success: true,
    service: "day76-agentic-rag",
    status: "healthy",
  });
});

app.use("/api/agent", agentRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found.",
  });
});

export default app;
