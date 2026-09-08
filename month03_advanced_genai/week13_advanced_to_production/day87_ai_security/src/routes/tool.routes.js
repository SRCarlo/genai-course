import express from "express";
import { validateToolRequest } from "../security/input.validator.js";
import {
  authorizeTool,
  getToolRisk,
  validateToolArguments
} from "../security/tool.guard.js";
import { securityLog } from "../security/security.logger.js";

const router = express.Router();

router.post("/authorize", (req, res) => {
  const requestId = req.requestId;

  try {
    const input = validateToolRequest(req.body);
    const riskLevel = getToolRisk(input.toolName);

    const result = authorizeTool({
      toolName: input.toolName,
      userRole: input.role,
      riskLevel
    });

    if (result.allowed) {
      validateToolArguments(input.toolName, input.arguments);
    }

    securityLog({
      event: "tool_authorization",
      requestId,
      toolName: input.toolName,
      role: input.role,
      riskLevel,
      decision: result.allowed ? "ALLOW" : "DENY",
      reason: result.reason
    });

    return res.status(result.allowed || result.approvalRequired ? 200 : 403).json({
      toolName: input.toolName,
      riskLevel,
      ...result
    });
  } catch (error) {
    securityLog({
      event: "tool_authorization_error",
      requestId,
      errorType: error?.name || "UnknownError"
    });

    return res.status(400).json({
      error: {
        code: "INVALID_TOOL_REQUEST",
        message: "The tool request is invalid."
      }
    });
  }
});

export default router;
