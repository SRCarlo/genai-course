import express from "express";

import evaluationRoutes from "./routes/evaluation.routes.js";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "day73-genai-evaluation",
  });
});

app.use("/api/evaluation", evaluationRoutes);

export default app;
