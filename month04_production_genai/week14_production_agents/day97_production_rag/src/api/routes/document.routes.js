import express from "express";
import { auth } from "../middleware/auth.js";
import { createDocumentController } from "../controllers/document.controller.js";

export function createDocumentRouter(documentService) {
  const router = express.Router();

  const controller = createDocumentController(documentService);

  router.post("/documents", auth, controller);

  return router;
}
