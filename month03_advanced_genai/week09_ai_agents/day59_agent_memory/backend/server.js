import "dotenv/config";

import express from "express";

import chatRoutes from "./routes/chatRoutes.js";

const app = express();

const PORT = process.env.PORT || 3000;

/**
 * Middleware
 */
app.use(express.json());

/**
 * Health check
 */
app.get("/health", (req, res) => {
  res.json({
    success: true,
    service: "day59-agent-memory",
    status: "healthy",
  });
});

/**
 * API routes
 */
app.use("/api", chatRoutes);

/**
 * 404 handler
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

/**
 * Global error handler
 */
app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);

  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`Day 59 server running on http://localhost:${PORT}`);
});
