import {
  saveUsageEvent,
  getUsageEvents,
  getUsageEvent,
} from "../models/usage.model.js";

import { calculateCost } from "../utils/cost.js";

export function createUsageEvent({
  requestId,
  userId,
  tenantId,
  model,
  endpoint,
  inputTokens = 0,
  outputTokens = 0,
  latencyMs = 0,
  status,
}) {
  const totalTokens = inputTokens + outputTokens;

  const cost = calculateCost({
    inputTokens,
    outputTokens,
  });

  return {
    requestId,
    userId,
    tenantId,
    model,
    endpoint,

    inputTokens,
    outputTokens,
    totalTokens,

    cost,

    latencyMs,
    status,

    createdAt: new Date().toISOString(),
  };
}

export function recordUsage(data) {
  const event = createUsageEvent(data);

  return saveUsageEvent(event);
}

export function listUsage() {
  return getUsageEvents();
}

export function findUsage(requestId) {
  return getUsageEvent(requestId);
}
