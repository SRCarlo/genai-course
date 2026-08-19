import express from "express";

import { config } from "./config/env.js";

import healthRoutes from "./routes/health.routes.js";

import agentRoutes from "./routes/agent.routes.js";

import { securityMiddleware } from "./middleware/security.js";

import { requestLogger } from "./middleware/requestLogger.js";

import { apiRateLimiter } from "./middleware/rateLimiter.js";

import { notFoundHandler } from "./middleware/notFound.js";

import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

/*
 * Security headers
 */
securityMiddleware(app);

/*
 * Request ID + logging
 */
app.use(requestLogger);

/*
 * JSON parser
 */
app.use(
  express.json({
    limit: config.maxRequestSize,
  }),
);

/*
 * Root endpoint
 */
app.get("/", (req, res) => {
  res.status(200).json({
    service: "GenAI API",

    status: "running",

    environment: config.nodeEnv,

    requestId: req.requestId,
  });
});

/*
 * Health routes
 *
 * Health endpoints are kept
 * outside the normal API rate limiter.
 */
app.use(healthRoutes);

/*
 * Rate limiting for API
 */
app.use("/api", apiRateLimiter);

/*
 * GenAI routes
 */
app.use(agentRoutes);

/*
 * 404 handler
 */
app.use(notFoundHandler);

/*
 * Global error handler
 */
app.use(errorHandler);

export default app;
