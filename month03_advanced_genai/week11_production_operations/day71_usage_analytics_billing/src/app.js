import express from "express";
import cors from "cors";

import aiRoutes from "./routes/ai.routes.js";
import usageRoutes from "./routes/usage.routes.js";
import billingRoutes from "./routes/billing.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";

const app = express();

app.use(cors());

app.use(
  express.json({
    limit: "1mb",
  }),
);

app.get("/health", (req, res) => {
  res.json({
    success: true,
    service: "day71-usage-analytics-billing",
  });
});

app.use("/api/ai", aiRoutes);

app.use("/api/usage", usageRoutes);

app.use("/api/billing", billingRoutes);

app.use("/api/analytics", analyticsRoutes);

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

export default app;
