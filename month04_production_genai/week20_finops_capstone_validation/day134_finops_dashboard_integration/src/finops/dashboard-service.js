"use strict";

const { getBudgetStatus } = require("./budget-status");
const { estimateCacheSavings } = require("./cache-savings");

function buildFinOpsDashboard({
  tenantId,
  events,
  budget,
  estimatedAvoidedProviderCost = 0,
}) {
  if (typeof tenantId !== "string" || !tenantId.trim()) {
    throw new TypeError("tenantId is required");
  }

  if (!Array.isArray(events)) {
    throw new TypeError("events must be an array");
  }

  // Defense in depth: never aggregate events from another tenant.
  const scopedEvents = events.filter(
    (event) => event.tenantId === tenantId
  );

  const seenIds = new Set();
  const byModel = new Map();

  let inputTokens = 0;
  let outputTokens = 0;
  let providerCost = 0;
  let succeeded = 0;
  let failed = 0;
  let cacheHits = 0;
  let cacheMisses = 0;

  for (const event of scopedEvents) {
    if (
      typeof event.eventId !== "string" ||
      !event.eventId.trim()
    ) {
      throw new TypeError("Each event requires an eventId");
    }

    if (seenIds.has(event.eventId)) {
      throw new Error(`Duplicate eventId: ${event.eventId}`);
    }

    seenIds.add(event.eventId);

    if (
      typeof event.model !== "string" ||
      !event.model.trim()
    ) {
      throw new TypeError("Each event requires a model");
    }

    for (const field of [
      "inputTokens",
      "outputTokens",
      "providerCost",
    ]) {
      if (!Number.isFinite(event[field]) || event[field] < 0) {
        throw new TypeError(`${field} must be non-negative`);
      }
    }

    inputTokens += event.inputTokens;
    outputTokens += event.outputTokens;
    providerCost += event.providerCost;

    if (event.status === "succeeded") succeeded += 1;
    else if (event.status === "failed") failed += 1;
    else throw new TypeError("Invalid event status");

    if (event.cacheStatus === "hit") cacheHits += 1;
    if (event.cacheStatus === "miss") cacheMisses += 1;

    const current = byModel.get(event.model) || {
      model: event.model,
      requests: 0,
      inputTokens: 0,
      outputTokens: 0,
      providerCost: 0,
    };

    current.requests += 1;
    current.inputTokens += event.inputTokens;
    current.outputTokens += event.outputTokens;
    current.providerCost += event.providerCost;

    byModel.set(event.model, current);
  }

  const requests = scopedEvents.length;
  const cacheLookups = cacheHits + cacheMisses;

  return {
    tenantId,
    generatedAt: new Date().toISOString(),
    summary: {
      requests,
      succeeded,
      failed,
      successRate:
        requests === 0
          ? null
          : Number((succeeded / requests * 100).toFixed(2)),
      inputTokens,
      outputTokens,
      providerCost: Number(providerCost.toFixed(6)),
      averageProviderCost:
        requests === 0
          ? null
          : Number((providerCost / requests).toFixed(6)),
      cacheHits,
      cacheMisses,
      cacheHitRate:
        cacheLookups === 0
          ? null
          : Number((cacheHits / cacheLookups * 100).toFixed(2)),
    },
    budget: getBudgetStatus({
      spent: providerCost,
      budget,
    }),
    cacheSavings: estimateCacheSavings({
      cacheHits,
      estimatedAvoidedProviderCost,
    }),
    byModel: [...byModel.values()].sort(
      (a, b) => b.providerCost - a.providerCost
    ),
  };
}

module.exports = { buildFinOpsDashboard };
