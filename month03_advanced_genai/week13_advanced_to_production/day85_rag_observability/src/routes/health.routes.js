import express from "express";

export function createHealthRoutes() {
  const router =
    express.Router();

  router.get(
    "/health",
    (req, res) => {
      res.json({
        status: "ok",
        service: "rag-api",
        timestamp:
          new Date().toISOString()
      });
    }
  );

  return router;
}