import { z } from "zod";

const allowedTools = {
  searchDocuments: {
    roles: ["user", "admin"],
    risk: "LOW"
  },
  generateReport: {
    roles: ["user", "admin"],
    risk: "LOW"
  },
  sendEmail: {
    roles: ["admin"],
    risk: "MEDIUM"
  },
  modifyAccount: {
    roles: ["admin"],
    risk: "HIGH"
  },
  deleteUser: {
    roles: ["admin"],
    risk: "CRITICAL"
  }
};

export function canExecuteTool(toolName, userRole) {
  const tool = allowedTools[toolName];
  return Boolean(tool && tool.roles.includes(userRole));
}

export function getToolRisk(toolName) {
  return allowedTools[toolName]?.risk ?? "CRITICAL";
}

const getUserSchema = z.object({
  userId: z.string().uuid()
});

export function validateToolArguments(toolName, args) {
  if (toolName === "getUser") {
    return getUserSchema.parse(args);
  }

  return z.record(z.unknown()).parse(args);
}

export function authorizeTool({ toolName, userRole, riskLevel }) {
  if (!allowedTools[toolName]) {
    return { allowed: false, approvalRequired: false, reason: "UNKNOWN_TOOL" };
  }

  if (!canExecuteTool(toolName, userRole)) {
    return { allowed: false, approvalRequired: false, reason: "INSUFFICIENT_ROLE" };
  }

  if (riskLevel === "CRITICAL") {
    return { allowed: false, approvalRequired: true, reason: "HUMAN_APPROVAL_REQUIRED" };
  }

  return { allowed: true, approvalRequired: false, reason: "AUTHORIZED" };
}
