import express from "express";

import chatRoutes from "./api/routes/chat.routes.js";

import { auth } from "./api/middleware/auth.js";

import { rateLimit } from "./api/middleware/rateLimit.js";

import { errorHandler } from "./api/middleware/errorHandler.js";

import { config } from "./config/config.js";

import { logger } from "./infrastructure/observability/logger.js";

const app = express();

app.use(
  express.json({
    limit: "1mb",
  }),
);

// Request Logging

app.use((req, res, next) => {
  logger.info("Incoming request", {
    method: req.method,
    path: req.path,
  });

  next();
});

// Liveness

app.get("/health/live", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

//  Readiness

app.get("/health/ready", (req, res) => {
  res.status(200).json({
    status: "ready",
    environment: config.environment,
  });
});

// Simple Health

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

// API

app.use(
  "/api",

  auth,

  rateLimit({
    windowMs: config.rateLimit.windowMs,

    maxRequests: config.rateLimit.maxRequests,
  }),

  chatRoutes,
);

// 404

app.use((req, res) => {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: "Route not found.",
    },
  });
});

// Global Error Handler

app.use(errorHandler);

export default app;
