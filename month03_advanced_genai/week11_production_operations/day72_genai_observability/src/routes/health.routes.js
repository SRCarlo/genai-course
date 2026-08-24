import { Router } from "express";

const router = Router();

router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "day72-genai-observability",
    timestamp: new Date().toISOString(),
  });
});

router.get("/health/live", (req, res) => {
  res.json({
    status: "alive",
    timestamp: new Date().toISOString(),
  });
});

router.get("/health/ready", async (req, res) => {
  /*
   * In a real system:
   *
   * databaseReady = await db.ping()
   * redisReady = await redis.ping()
   * queueReady = await queue.check()
   */

  const databaseReady = true;
  const redisReady = true;

  const ready = databaseReady && redisReady;

  if (!ready) {
    return res.status(503).json({
      status: "not_ready",

      dependencies: {
        database: databaseReady,

        redis: redisReady,
      },
    });
  }

  res.json({
    status: "ready",

    dependencies: {
      database: databaseReady,

      redis: redisReady,
    },

    timestamp: new Date().toISOString(),
  });
});

export default router;
