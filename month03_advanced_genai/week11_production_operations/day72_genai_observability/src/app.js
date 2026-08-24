import express from "express";

import healthRoutes from "./routes/health.routes.js";

import aiRoutes from "./routes/ai.routes.js";

import { requestId } from "./middleware/requestId.js";

import { requestLogger } from "./middleware/logger.js";

import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(
  express.json({
    limit: "1mb",
  }),
);

app.use(requestId);

app.use(requestLogger);

app.get("/", (req, res) => {
  res.json({
    service: "day72-genai-observability",

    message: "GenAI observability API",

    requestId: req.requestId,

    correlationId: req.correlationId,
  });
});

app.use(healthRoutes);

app.use("/api", aiRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: "route_not_found",

    requestId: req.requestId,
  });
});

app.use(errorHandler);

export default app;
