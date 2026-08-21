import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import { requireTenant } from "../middleware/tenant.js";
import { getTenantDocuments } from "../services/document.service.js";

const router = express.Router();

router.get("/users", authenticate, authorize("admin"), (req, res) => {
  res.json({
    message: "Admin user management endpoint",
    tenantId: req.user.tenantId,
  });
});

router.post(
  "/reindex",
  authenticate,
  authorize("admin"),
  requireTenant,
  (req, res) => {
    res.json({
      message: "Tenant reindex operation authorized",
      tenantId: req.tenantId,
    });
  },
);

router.get(
  "/tenant-documents",
  authenticate,
  authorize("admin"),
  requireTenant,
  (req, res) => {
    const documents = getTenantDocuments(req.tenantId);

    res.json({
      tenantId: req.tenantId,
      documents,
    });
  },
);

export default router;
