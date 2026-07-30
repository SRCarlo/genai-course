import { countTokens } from "../monitoring/tokenTracker.js";

import { calculateCost } from "../monitoring/costTracker.js";

import { log } from "../monitoring/logger.js";

import { addTraceStep } from "../tracing/traceManager.js";

export function chatController(req, res) {
  const message = req.body.message;

  log("User request received");

  addTraceStep(req.traceId, "AI Agent Started");

  // Token calculation

  const tokens = countTokens(message);

  // Cost calculation

  const cost = calculateCost(tokens);

  addTraceStep(req.traceId, "LLM Completed");

  res.json({
    reply: "AI Response Generated",

    monitoring: {
      tokens,

      cost,

      traceId: req.traceId,
    },
  });
}
