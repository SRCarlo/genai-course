import express from "express";

import { authenticate } from "./middleware/auth.js";

import { errorHandler } from "./middleware/errorHandler.js";

import aiRoutes from "./routes/ai.routes.js";

const app = express();

app.set("trust proxy", 1);

app.use(
  express.json({
    limit: "1mb",
  }),
);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "day70-rate-limiting-cost-control",
  });
});

app.use("/api", authenticate, aiRoutes);

app.use(errorHandler);

export default app;
