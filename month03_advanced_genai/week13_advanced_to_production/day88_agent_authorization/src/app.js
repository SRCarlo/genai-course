import "dotenv/config";
import express from "express";
import agentRoutes from "./routes/agent.routes.js";

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.disable("x-powered-by");
app.use(express.json({ limit: "100kb" }));

app.get("/", (_req, res) => {
  res.json({
    status: "success",
    project: "Day 88 - Secure AI Agent Authorization Gateway",
    model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
    securityBoundary: "LLM -> Tool Gateway -> Authorization -> Validation -> Risk -> Approval -> Tool"
  });
});

app.use("/api/agent", agentRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, error: "ROUTE_NOT_FOUND" });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ success: false, error: "INTERNAL_SERVER_ERROR" });
});

app.listen(PORT, () => {
  console.log(`Day 88 server running on http://localhost:${PORT}`);
});
