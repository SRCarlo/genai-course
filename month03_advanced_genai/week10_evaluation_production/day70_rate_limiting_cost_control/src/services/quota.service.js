const usageStore = new Map();

function getMonthKey(date = new Date()) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(
    2,
    "0",
  )}`;
}

function getKey(tenantId) {
  return `${tenantId}:${getMonthKey()}`;
}

function getUsage(tenantId) {
  const key = getKey(tenantId);

  if (!usageStore.has(key)) {
    usageStore.set(key, {
      tokens: 0,
      costUsd: 0,
    });
  }

  return usageStore.get(key);
}

export function getCurrentUsage(tenantId) {
  return {
    ...getUsage(tenantId),
    month: getMonthKey(),
  };
}

export function canConsume({
  tenantId,
  additionalTokens,
  additionalCostUsd,
  tokenLimit,
  budgetUsd,
}) {
  const usage = getUsage(tenantId);

  return {
    allowed:
      usage.tokens + additionalTokens <= tokenLimit &&
      usage.costUsd + additionalCostUsd <= budgetUsd,

    currentTokens: usage.tokens,

    projectedTokens: usage.tokens + additionalTokens,

    tokenLimit,

    currentCostUsd: usage.costUsd,

    projectedCostUsd: usage.costUsd + additionalCostUsd,

    budgetUsd,
  };
}

export function recordQuotaUsage({ tenantId, tokens, costUsd }) {
  const usage = getUsage(tenantId);

  usage.tokens += tokens;
  usage.costUsd += costUsd;

  return {
    ...usage,
    month: getMonthKey(),
  };
}

export function resetQuotaStore() {
  usageStore.clear();
}
