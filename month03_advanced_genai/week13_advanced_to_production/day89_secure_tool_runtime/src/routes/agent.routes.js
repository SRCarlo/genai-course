import express from "express";
import crypto from "node:crypto";

import { callLLM } from "../llm/llm.service.js";
import { runAgent } from "../runtime/agent.loop.js";
import { executeTool } from "../runtime/tool.gateway.js";

import { supportAgent } from "../agents/support.agent.js";
import { financeAgent } from "../agents/finance.agent.js";
import { adminAgent } from "../agents/admin.agent.js";

const router =
  express.Router();

const agents = {
  support: supportAgent,
  finance: financeAgent,
  admin: adminAgent
};

router.post("/run", async (req, res) => {
  try {
    const {
      message,
      agent = "support",
      approval = false
    } = req.body;

    if (
      !message ||
      typeof message !== "string"
    ) {
      return res.status(400).json({
        error: "MESSAGE_REQUIRED"
      });
    }

    const selectedAgent =
      agents[agent];

    if (!selectedAgent) {
      return res.status(400).json({
        error: "UNKNOWN_AGENT"
      });
    }

    const requestId =
      crypto.randomUUID();

    const authContext = {
      request: {
        id: requestId
      },

      user: {
        id: "demo-user",

        permissions:
          agent === "admin"
            ? [
                "order:read",
                "order:refund",
                "customer:delete"
              ]
            : agent === "finance"
              ? [
                  "order:read",
                  "order:refund"
                ]
              : [
                  "order:read"
                ]
      },

      agent: selectedAgent
    };

    const messages = [
      {
        role: "user",
        content: message
      }
    ];

    const answer =
      await runAgent({
        llm: callLLM,

        messages,

        executeTool: (toolCall) =>
          executeTool({
            toolName:
              toolCall.tool,

            arguments:
              toolCall.arguments,

            authContext,

            approval
          }),

        maxToolCalls: 10
      });

    return res.json({
      success: true,

      requestId,

      agent: selectedAgent.name,

      response: answer
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,

      error:
        error.code ||
        error.message ||
        "AGENT_ERROR"
    });
  }
});

export default router;