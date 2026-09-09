import { Router } from "express";
import { randomUUID } from "node:crypto";
import { executeTool } from "../security/tool.gateway.js";
import { tools } from "../tools/index.js";
import { planToolCall } from "../ai/agent.planner.js";
import { getUserPermissions } from "../security/authorization.js";
import { supportAgent } from "../agents/support.agent.js";
import { financeAgent } from "../agents/finance.agent.js";
import { adminAgent } from "../agents/admin.agent.js";

const router = Router();

const agentMap = {
  support: supportAgent,
  finance: financeAgent,
  admin: adminAgent
};

router.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "day88-agent-authorization" });
});

router.post("/authorize", async (req, res) => {
  try {
    const {
      user = { id: "user-123", role: "customer" },
      agentType = "support",
      tool: toolName,
      arguments: toolArguments = {},
      approved = false
    } = req.body;

    const agent = agentMap[agentType];
    const tool = tools[toolName];

    if (!agent) {
      return res.status(403).json({ error: "UNKNOWN_AGENT" });
    }

    const authContext = {
      user: {
        ...user,
        permissions: getUserPermissions(user.role)
      },
      agent,
      request: { id: randomUUID() }
    };

    const result = await executeTool({
      tool,
      arguments: toolArguments,
      authContext,
      requireApproval: approved
    });

    return res.json({
      success: true,
      requestId: authContext.request.id,
      result
    });
  } catch (error) {
    const status =
      error.message === "TOOL_NOT_FOUND" ? 404 :
      error.message === "TOOL_NOT_AUTHORIZED" ? 403 :
      error.message === "INVALID_TOOL_ARGUMENTS" ? 400 :
      error.message === "RESOURCE_NOT_AUTHORIZED" ? 403 : 500;

    return res.status(status).json({
      success: false,
      error: error.message
    });
  }
});

router.post("/plan", async (req, res) => {
  try {
    const { message } = req.body;

    if (typeof message !== "string" || message.trim().length < 2) {
      return res.status(400).json({ error: "INVALID_MESSAGE" });
    }

    const plan = await planToolCall(message);
    return res.json({
      success: true,
      model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
      plan,
      note: "Plan only. The authorization gateway must independently authorize execution."
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
