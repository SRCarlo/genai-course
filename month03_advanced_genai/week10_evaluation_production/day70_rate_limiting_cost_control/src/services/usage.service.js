const usageRecords = [];

export function recordUsage({
  requestId,
  userId,
  tenantId,
  model,
  inputTokens,
  outputTokens,
  totalTokens,
  cost,
}) {
  const record = {
    requestId,
    userId,
    tenantId,
    model,

    inputTokens,
    outputTokens,
    totalTokens,

    cost,

    recordedAt: new Date().toISOString(),
  };

  usageRecords.push(record);

  return record;
}

export function getUsageRecords() {
  return usageRecords;
}

export function getUserUsage(userId) {
  return usageRecords.filter((record) => record.userId === userId);
}

export function getTenantUsage(tenantId) {
  return usageRecords.filter((record) => record.tenantId === tenantId);
}

export function resetUsage() {
  usageRecords.length = 0;
}
