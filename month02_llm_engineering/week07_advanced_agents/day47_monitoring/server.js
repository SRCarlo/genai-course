import express from "express";
import dotenv from "dotenv";

import { monitoringMiddleware } from "./middleware/monitoringMiddleware.js";

import { errorHandler } from "./middleware/errorHandler.js";

import { chatController } from "./assignment/ai_monitoring_system.js";

import { getDashboard } from "./dashboards/dashboard.js";

dotenv.config();

const app = express();

app.use(express.json());

// Monitoring middleware
app.use(monitoringMiddleware);

app.get("/", (req, res) => {
  res.json({
    message: "Day 47 AI Monitoring System Running",
  });
});

// AI endpoint

app.post("/chat", chatController);

// Dashboard endpoint

app.get("/dashboard", (req, res) => {
  res.json(getDashboard());
});

// Error handler

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
