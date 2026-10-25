function validateEvents(events) {
  if (!Array.isArray(events)) {
    throw new TypeError("events must be an array");
  }

  for (const event of events) {
    if (
      !event ||
      typeof event.eventId !== "string" ||
      typeof event.tenantId !== "string" ||
      typeof event.model !== "string"
    ) {
      throw new TypeError("Each event needs an ID, tenant and model");
    }

    if (!["SUCCEEDED", "FAILED"].includes(event.status)) {
      throw new TypeError("Invalid event status");
    }

    for (const field of ["inputTokens", "outputTokens", "providerCost"]) {
      if (!Number.isFinite(event[field]) || event[field] < 0) {
        throw new TypeError(`${field} must be non-negative`);
      }
    }

    if (!Number.isFinite(Date.parse(event.timestamp))) {
      throw new TypeError("Invalid event timestamp");
    }

    if (!["HIT", "MISS", "BYPASS"].includes(event.cacheStatus)) {
      throw new TypeError("Invalid cache status");
    }
  }
}

function summarizeUsage(events, { tenantId } = {}) {
  validateEvents(events);

  const scopedEvents = tenantId
    ? events.filter((event) => event.tenantId === tenantId)
    : events;

  const eventIds = new Set();

  for (const event of scopedEvents) {
    if (eventIds.has(event.eventId)) {
      throw new Error("Duplicate eventId in analytics input");
    }

    eventIds.add(event.eventId);
  }

  const summary = {
    eventCount: scopedEvents.length,
    succeeded: 0,
    failed: 0,
    inputTokens: 0,
    outputTokens: 0,
    providerCost: 0,
    cacheHits: 0,
    cacheMisses: 0,
    cacheBypasses: 0,
    byTenant: {},
    byModel: {},
  };

  for (const event of scopedEvents) {
    summary[event.status === "SUCCEEDED" ? "succeeded" : "failed"]++;
    summary.inputTokens += event.inputTokens;
    summary.outputTokens += event.outputTokens;
    summary.providerCost += event.providerCost;

    if (event.cacheStatus === "HIT") summary.cacheHits++;
    if (event.cacheStatus === "MISS") summary.cacheMisses++;
    if (event.cacheStatus === "BYPASS") summary.cacheBypasses++;

    for (const [group, key] of [
      ["byTenant", event.tenantId],
      ["byModel", event.model],
    ]) {
      const row = (summary[group][key] ??= {
        events: 0,
        inputTokens: 0,
        outputTokens: 0,
        providerCost: 0,
      });

      row.events++;
      row.inputTokens += event.inputTokens;
      row.outputTokens += event.outputTokens;
      row.providerCost += event.providerCost;
    }
  }

  const cacheLookups = summary.cacheHits + summary.cacheMisses;

  summary.successRate =
    summary.eventCount === 0 ? 0 : summary.succeeded / summary.eventCount;

  summary.cacheHitRate =
    cacheLookups === 0 ? 0 : summary.cacheHits / cacheLookups;

  summary.averageProviderCost =
    summary.eventCount === 0 ? 0 : summary.providerCost / summary.eventCount;

  return summary;
}

module.exports = { summarizeUsage };
