import { quotaUsage } from "../data/store.js";
import { env } from "../config/env.js";

function getQuotaForPlan(plan) {
  switch (plan) {
    case "enterprise":
      return env.enterpriseDailyQuota;

    case "pro":
      return env.proDailyQuota;

    default:
      return env.freeDailyQuota;
  }
}

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function checkAndConsumeQuota({ userId, tenantId, plan }) {
  const key = `${tenantId}:${userId}:${getTodayKey()}`;

  const limit = getQuotaForPlan(plan);

  const current = quotaUsage.get(key) || 0;

  if (current >= limit) {
    return {
      allowed: false,
      limit,
      used: current,
    };
  }

  quotaUsage.set(key, current + 1);

  return {
    allowed: true,
    limit,
    used: current + 1,
  };
}
