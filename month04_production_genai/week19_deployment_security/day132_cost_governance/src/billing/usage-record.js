const crypto = require("node:crypto");

function createUsageRecord({
  tenantId,
  requestId,
  model,
  inputTokens,
  outputTokens,
  costDollars,
  status,
}) {
  if (typeof tenantId !== "string" || !tenantId.trim()) {
    throw new TypeError("tenantId is required");
  }

  if (typeof requestId !== "string" || !requestId.trim()) {
    throw new TypeError("requestId is required");
  }

  if (typeof model !== "string" || !model.trim()) {
    throw new TypeError("model is required");
  }

  for (const [name, value] of Object.entries({
    inputTokens,
    outputTokens,
    costDollars,
  })) {
    if (!Number.isFinite(value) || value < 0) {
      throw new TypeError(`${name} must be non-negative`);
    }
  }

  if (!["SUCCEEDED", "FAILED"].includes(status)) {
    throw new TypeError("Unsupported usage status");
  }

  return {
    eventId: crypto.randomUUID(),
    tenantId,
    requestId,
    model,
    inputTokens,
    outputTokens,
    costDollars,
    status,
    recordedAt: new Date().toISOString(),
  };
}

module.exports = { createUsageRecord };
