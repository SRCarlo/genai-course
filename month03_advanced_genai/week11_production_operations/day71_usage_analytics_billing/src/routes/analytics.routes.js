import express from "express";

import {
  getOverview,
  getModelAnalytics,
  getTenantAnalytics,
  getUserAnalytics,
  getEndpointAnalytics,
  getDailyAnalytics,
  getMonthlyAnalytics,
} from "../services/analytics.service.js";

const router = express.Router();

function requireAdmin(req, res, next) {
  const role = req.header("x-role");

  if (role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  next();
}

router.use(requireAdmin);

router.get("/overview", (req, res) => {
  res.json({
    success: true,
    data: getOverview(),
  });
});

router.get("/models", (req, res) => {
  res.json({
    success: true,
    data: getModelAnalytics(),
  });
});

router.get("/tenants", (req, res) => {
  res.json({
    success: true,
    data: getTenantAnalytics(),
  });
});

router.get("/users", (req, res) => {
  res.json({
    success: true,
    data: getUserAnalytics(),
  });
});

router.get("/endpoints", (req, res) => {
  res.json({
    success: true,
    data: getEndpointAnalytics(),
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

export default router;
