import express from "express";

import { listUsage, findUsage } from "../services/usage.service.js";

import {
  getOverview,
  getTenantAnalytics,
  getUserAnalytics,
  getModelAnalytics,
  getDailyAnalytics,
  getMonthlyAnalytics,
} from "../services/analytics.service.js";

const router = express.Router();

router.get("/me", (req, res) => {
  const userId = req.header("x-user-id") || "user_demo";

  const events = listUsage().filter((event) => event.userId === userId);

  res.json({
    success: true,
    userId,
    usage: events,
  });
});

router.get("/tenant", (req, res) => {
  const tenantId = req.header("x-tenant-id") || "tenant_demo";

  const events = listUsage().filter((event) => event.tenantId === tenantId);

  res.json({
    success: true,
    tenantId,
    usage: events,
  });
});

router.get("/daily", (req, res) => {
  res.json({
    success: true,
    data: getDailyAnalytics(),
  });
});

router.get("/monthly", (req, res) => {
  res.json({
    success: true,
    data: getMonthlyAnalytics(),
  });
});

router.get("/:requestId", (req, res) => {
  const event = findUsage(req.params.requestId);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: "Usage event not found",
    });
  }

  res.json({
    success: true,
    usage: event,
  });
});

export default router;
