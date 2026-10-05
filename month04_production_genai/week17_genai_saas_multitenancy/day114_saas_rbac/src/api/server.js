import "dotenv/config";
import express from "express";
import { fileURLToPath } from "node:url";
import { UserRegistry } from "../users/user-registry.js";
import { UserService } from "../users/user-service.js";
import { RoleService } from "../roles/role-service.js";
import { PermissionService } from "../permissions/permission-service.js";
import { PERMISSIONS } from "../permissions/permissions.js";
import { ApiKeyService } from "../auth/api-key.js";
import { AuthenticationService } from "../auth/authentication.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import { tenantContext } from "../middleware/tenant-context.js";
import {
  TenantAccessService,
  TenantRegistry,
} from "../tenants/tenant-access.js";
import { AIService } from "../ai/ai-service.js";
import { ToolService } from "../ai/tool-service.js";
import { AuditLogger } from "../audit/audit-logger.js";

export function createApp({ aiService = new AIService() } = {}) {
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json({ limit: "32kb" }));

  const userRegistry = new UserRegistry();
  const roleService = new RoleService();
  const permissionService = new PermissionService({ roleService });
  const apiKeyService = new ApiKeyService();
  const authenticationService = new AuthenticationService({
    apiKeyService,
    userRegistry,
  });
  const tenantRegistry = new TenantRegistry();
  const tenantAccessService = new TenantAccessService({ roleService });
  const userService = new UserService({ userRegistry, roleService });
  const auditLogger = new AuditLogger();
  const toolService = new ToolService({
    permissionService,
    tenantAccessService,
    auditLogger,
  });

  const requireAuth = authenticate(authenticationService, auditLogger);
  const requireTenant = tenantContext(tenantRegistry);
  const requirePermission = (permission) =>
    authorize(permissionService, permission, auditLogger);

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "day114-saas-rbac" });
  });

  app.use(requireAuth, requireTenant);

  app.get("/me", (req, res) => {
    res.json(userService.getMe(req.user));
  });

  app.get("/usage", requirePermission(PERMISSIONS.VIEW_USAGE), (req, res) => {
    res.json({ tenantId: req.tenant.id, usage: { requests: 0, tokens: 0 } });
  });

  app.get(
    "/admin/users",
    requirePermission(PERMISSIONS.MANAGE_USERS),
    (req, res) => {
      res.json({
        users: userService
          .listTenantUsers(req.tenant.id)
          .map(({ id, email, tenantId, role, active }) => ({
            id,
            email,
            tenantId,
            role,
            active,
          })),
      });
    },
  );

  app.get(
    "/billing",
    requirePermission(PERMISSIONS.MANAGE_BILLING),
    (req, res) => {
      res.json({ message: "Billing access allowed", tenantId: req.tenant.id });
    },
  );

  app.get(
    "/audit",
    requirePermission(PERMISSIONS.VIEW_AUDIT_LOGS),
    (req, res) => {
      res.json({ events: auditLogger.listForTenant(req.tenant.id) });
    },
  );

  app.post(
    "/ai/generate",
    requirePermission(PERMISSIONS.USE_AI),
    async (req, res, next) => {
      try {
        const result = await aiService.generate({
          user: req.user,
          tenant: req.tenant,
          prompt: req.body?.prompt,
        });
        auditLogger.log({
          userId: req.user.id,
          tenantId: req.tenant.id,
          action: "ai.request",
          resource: "ai/generate",
          result: "success",
          metadata: { model: result.model },
        });
        res.json(result);
      } catch (error) {
        auditLogger.log({
          userId: req.user.id,
          tenantId: req.tenant.id,
          action: "ai.request",
          resource: "ai/generate",
          result: "failure",
        });
        next(error);
      }
    },
  );

  app.post(
    "/ai/tools/:tool",
    requirePermission(PERMISSIONS.USE_AI),
    (req, res, next) => {
      try {
        const result = toolService.execute({
          user: req.user,
          tenant: req.tenant,
          tool: req.params.tool,
          args: req.body ?? {},
        });
        res.json(result);
      } catch (error) {
        next(error);
      }
    },
  );

  app.get("/resources/:resourceId", (req, res, next) => {
    try {
      const resource = tenantAccessService.getResource(req.params.resourceId);
      if (!tenantAccessService.canAccessResource(req.user, resource)) {
        auditLogger.log({
          userId: req.user.id,
          tenantId: req.user.tenantId,
          action: "resource.access",
          resource: resource.id,
          result: "denied",
        });
        return res.status(403).json({ error: "Resource access forbidden" });
      }
      res.json({
        id: resource.id,
        type: resource.type,
        tenantId: resource.tenantId,
        userId: resource.userId,
        content: resource.content,
      });
    } catch (error) {
      next(error);
    }
  });

  app.use((error, _req, res, _next) => {
    const status = Number.isInteger(error.statusCode) ? error.statusCode : 500;
    if (status >= 500) console.error(error);
    res
      .status(status)
      .json({ error: error.message || "Internal server error" });
  });

  return app;
}

const isMain =
  process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const port = Number(process.env.PORT || 3001);
  const app = createApp();
  app.listen(port, () =>
    console.log(`Day 114 server running on http://localhost:${port}`),
  );
}
