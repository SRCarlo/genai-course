export function createCostEvent({
  requestId,
  tenantId,
  userId,
  application,
  feature,
  workflow,
  model,
  inputTokens,
  outputTokens,
  cost,
  cacheHit = false,
  retryCount = 0,
  toolCalls = 0
}) {
  return {
    event: "AI_COST",
    requestId,
    tenantId,
    userId,
    application,
    feature,
    workflow,
    model,
    inputTokens,
    outputTokens,
    cost,
    cacheHit,
    retryCount,
    toolCalls,
    timestamp: new Date().toISOString()
  };
}