export function healthRoutes(app) {
  app.get("/health/live", (req, res) =>
    res
      .status(200)
      .json({ status: "alive", timestamp: new Date().toISOString() }),
  );
  app.get("/health/ready", async (req, res) => {
    const checks = { api: true };
    const ready = Object.values(checks).every(Boolean);
    if (!ready)
      return res
        .status(503)
        .json({
          status: "not_ready",
          checks,
          timestamp: new Date().toISOString(),
        });
    return res
      .status(200)
      .json({ status: "ready", checks, timestamp: new Date().toISOString() });
  });
}
