import { Router } from "express";
import { verifySignature } from "./signature.js";

export function createWebhookRouter({ webhookService, webhookSecret }) {
  const router = Router();

  router.post("/billing", async (req, res) => {
    if (!Buffer.isBuffer(req.body)) {
      return res.status(400).json({ error: "RAW_WEBHOOK_BODY_REQUIRED" });
    }

    const rawBody = req.body.toString("utf8");
    const signature = req.get("x-demo-signature");

    if (!verifySignature(rawBody, signature, webhookSecret)) {
      return res.status(401).json({ error: "INVALID_WEBHOOK_SIGNATURE" });
    }

    let event;
    try {
      event = JSON.parse(rawBody);
    } catch {
      return res.status(400).json({ error: "INVALID_WEBHOOK_JSON" });
    }

    try {
      const result = await webhookService.process(event, "mock");
      return res.status(200).json({ received: true, ...result });
    } catch (error) {
      if (error.message === "INVALID_BILLING_EVENT" ||
          error.message === "INVALID_SUBSCRIPTION_EVENT") {
        return res.status(400).json({ error: error.message });
      }
      // In production, use structured logging and a durable retry policy.
      return res.status(500).json({ error: "WEBHOOK_PROCESSING_FAILED" });
    }
  });

  return router;
}
