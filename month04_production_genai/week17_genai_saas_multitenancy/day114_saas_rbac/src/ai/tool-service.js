export class ToolService {
  constructor({ permissionService, tenantAccessService, auditLogger }) {
    this.permissionService = permissionService;
    this.tenantAccessService = tenantAccessService;
    this.auditLogger = auditLogger;
  }

  execute({ user, tenant, tool, args = {} }) {
    if (user.tenantId !== tenant.id)
      throw new Error("Tenant boundary violation");

    const requiredPermission = this.permissionService.toolPermission(tool);
    if (!requiredPermission) throw new Error(`Unknown tool: ${tool}`);

    if (!this.permissionService.check(user, requiredPermission)) {
      this.auditLogger.log({
        userId: user.id,
        tenantId: tenant.id,
        action: "ai.tool_call",
        resource: tool,
        result: "denied",
        metadata: { requiredPermission },
      });
      const error = new Error("Tool execution forbidden");
      error.statusCode = 403;
      throw error;
    }

    const result = {
      tool,
      tenantId: tenant.id,
      userId: user.id,
      args,
      status: "executed",
    };
    this.auditLogger.log({
      userId: user.id,
      tenantId: tenant.id,
      action: "ai.tool_call",
      resource: tool,
      result: "success",
    });
    return result;
  }
}
