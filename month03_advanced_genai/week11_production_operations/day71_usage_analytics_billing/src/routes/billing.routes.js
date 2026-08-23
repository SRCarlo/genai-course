import express from "express";

import { getPlans, calculateBilling } from "../services/billing.service.js";

import { getTenantAnalytics } from "../services/analytics.service.js";

import { checkBudget } from "../services/alert.service.js";

const router = express.Router();

router.get("/plans", (req, res) => {
  res.json({
    success: true,
    plans: getPlans(),
  });
});

router.get("/tenant", (req, res) => {
  const tenantId = req.header("x-tenant-id") || "tenant_demo";

  const tenants = getTenantAnalytics();

  const tenant = tenants.find((item) => item.tenantId === tenantId);

  if (!tenant) {
    return res.json({
      success: true,
      tenantId,
      providerCost: 0,
      billing: calculateBilling({
        providerCost: 0,
      }),
    });
  }

  const billing = calculateBilling({
    providerCost: tenant.cost,
  });

  const budget = 25;

  const budgetStatus = checkBudget({
    currentCost: tenant.cost,
    budget,
  });

  res.json({
    success: true,

    tenantId,

    providerCost: tenant.cost,

    billing,

    budget: budgetStatus,
  });
});

export default router;
