import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import { requireTenant } from "../middleware/tenant.js";
import {
  getDocumentForUser,
  getTenantDocuments,
} from "../services/document.service.js";

const router = express.Router();

router.get("/", authenticate, requireTenant, (req, res, next) => {
  try {
    const documents = getTenantDocuments(req.tenantId);

    /*
     * Normal users only see their own documents.
     * Admins see documents within their tenant.
     */
    const visibleDocuments =
      req.user.role === "admin"
        ? documents
        : documents.filter((document) => document.ownerId === req.user.id);

    res.json({
      documents: visibleDocuments,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:documentId", authenticate, requireTenant, (req, res, next) => {
  try {
    const document = getDocumentForUser({
      documentId: req.params.documentId,
      userId: req.user.id,
      tenantId: req.tenantId,
      role: req.user.role,
    });

    res.json({
      document,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
