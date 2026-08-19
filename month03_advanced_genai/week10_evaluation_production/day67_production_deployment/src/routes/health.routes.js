import express from "express";

const router = express.Router();

/*
 * Basic health check
 */
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",

    service: "genai-api",

    timestamp: new Date().toISOString(),
  });
});

/*
 * Liveness
 *
 * Is the Node.js process alive?
 */
router.get("/health/live", (req, res) => {
  res.status(200).json({
    status: "alive",

    service: "genai-api",

    timestamp: new Date().toISOString(),
  });
});

/*
 * Readiness
 *
 * Is the application ready
 * to receive traffic?
 */
router.get("/health/ready", (req, res) => {
  res.status(200).json({
    status: "ready",

    service: "genai-api",

    timestamp: new Date().toISOString(),
  });
});

export default router;
