import "dotenv/config";

import express from "express";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

import { ApiKeyService } from "../auth/api-key-service.js";
import { authenticateApiKey } from "../middleware/authenticate-api-key.js";
import { requireScope } from "../middleware/authorize-scope.js";
import { requireTenantResource } from "../middleware/tenant-boundary.js";
import { requireEnv } from "../security/secret-validator.js";
import { createSecurityEvent, audit } from "../security/security-events.js";
import { generateChatResponse } from "../ai/ai-service.js";
import { getUser } from "../users/user-store.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = Number(process.env.PORT || 3000);
const dataDir = path.resolve(
  __dirname,
  "../../",
  process.env.DATA_DIR || "./data"
);

const apiKeyService = new ApiKeyService({
  filePath: path.join(dataDir, "api-keys.json")
});

const app = express();

app.disable("x-powered-by");
app.use(express.json({ limit: "32kb" }));

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "day115-api-keys"
  });
});

const apiAuth = authenticateApiKey(apiKeyService);

app.post(
  "/v1/api-keys",
  apiAuth,
  async (req, res) => {
    try {
      const {
        name,
        scopes,
        expiresAt = null
      } = req.body ?? {};

      const created = await apiKeyService.create({
        userId: req.identity.userId,
        tenantId: req.identity.tenantId,
        name,
        scopes,
        expiresAt
      });

      audit(
        createSecurityEvent({
          event: "api_key_created",
          tenantId: req.identity.tenantId,
          userId: req.identity.userId,
          keyId: created.id,
          metadata: {
            scopes: created.scopes
          }
        })
      );

      return res.status(201).json(created);
    } catch (error) {
      return res.status(400).json({
        error: error.message
      });
    }
  }
);

app.get(
  "/v1/api-keys",
  apiAuth,
  async (req, res) => {
    const keys = await apiKeyService.listByTenant(
      req.identity.tenantId
    );

    return res.json({ data: keys });
  }
);

app.delete(
  "/v1/api-keys/:id",
  apiAuth,
  async (req, res) => {
    try {
      const revoked = await apiKeyService.revoke(
        req.params.id,
        req.identity.tenantId
      );

      audit(
        createSecurityEvent({
          event: "api_key_revoked",
          tenantId: req.identity.tenantId,
          userId: req.identity.userId,
          keyId: revoked.id
        })
      );

      return res.json(revoked);
    } catch {
      return res.status(404).json({
        error: "API key not found"
      });
    }
  }
);

app.post(
  "/v1/api-keys/:id/rotate",
  apiAuth,
  async (req, res) => {
    try {
      const rotated = await apiKeyService.rotate({
        keyId: req.params.id,
        requesterUserId: req.identity.userId,
        requesterTenantId: req.identity.tenantId
      });

      audit(
        createSecurityEvent({
          event: "api_key_rotated",
          tenantId: req.identity.tenantId,
          userId: req.identity.userId,
          keyId: rotated.id
        })
      );

      return res.status(201).json(rotated);
    } catch (error) {
      return res.status(400).json({
        error: error.message
      });
    }
  }
);

app.post(
  "/v1/chat",
  apiAuth,
  requireScope("chat:write"),
  requireTenantResource(),
  async (req, res) => {
    const { message } = req.body ?? {};

    if (
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      return res.status(400).json({
        error: "message is required"
      });
    }

    if (message.length > 8000) {
      return res.status(400).json({
        error: "message is too long"
      });
    }

    const user = getUser(req.identity.userId);

    if (!user || user.tenantId !== req.identity.tenantId) {
      return res.status(403).json({
        error: "Tenant boundary violation"
      });
    }

    try {
      const aiResult = await generateChatResponse(message);

      const requestId = `req_${crypto.randomUUID()}`;

      audit(
        createSecurityEvent({
          event: "ai_chat_completed",
          tenantId: req.identity.tenantId,
          userId: req.identity.userId,
          keyId: req.identity.keyId,
          metadata: {
            requestId,
            model: aiResult.model
          }
        })
      );

      return res.json({
        requestId,
        tenantId: req.identity.tenantId,
        model: aiResult.model,
        response: aiResult.response
      });
    } catch (error) {
      console.error("[ai-error]", {
        name: error.name,
        message: error.message
      });

      return res.status(502).json({
        error: "AI provider request failed"
      });
    }
  }
);

app.use((_req, res) => {
  res.status(404).json({
    error: "Not found"
  });
});

app.use((error, _req, res, _next) => {
  console.error("[server-error]", {
    name: error.name,
    message: error.message
  });

  res.status(500).json({
    error: "Internal server error"
  });
});


requireEnv("GROQ_API_KEY");

app.listen(port, () => {
  console.log(`Day 115 API running on http://localhost:${port}`);
  console.log(`Groq model: ${process.env.GROQ_MODEL || "openai/gpt-oss-20b"}`);
});
