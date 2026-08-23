import { listUsage } from "./usage.service.js";

import {
  aggregateUsage,
  calculateAverageLatency,
} from "../utils/aggregation.js";

function groupBy(events, key) {
  const groups = {};

  for (const event of events) {
    const value = event[key];

    if (!groups[value]) {
      groups[value] = [];
    }

    groups[value].push(event);
  }

  return groups;
}

export function getOverview() {
  const events = listUsage();

  const summary = aggregateUsage(events);

  const averageLatency = calculateAverageLatency(events);

  const errorRate =
    events.length === 0
      ? 0
      : Number(((summary.failedRequests / events.length) * 100).toFixed(2));

  return {
    ...summary,

    cost: Number(summary.cost.toFixed(8)),

    averageLatencyMs: averageLatency,

    errorRate,
  };
}

export function getModelAnalytics() {
  const events = listUsage();

  const groups = groupBy(events, "model");

  return Object.entries(groups)
    .map(([model, modelEvents]) => {
      const summary = aggregateUsage(modelEvents);

      return {
        model,

        requests: summary.requests,

        totalTokens: summary.totalTokens,

        cost: Number(summary.cost.toFixed(8)),

        averageLatencyMs: calculateAverageLatency(modelEvents),

        successRate:
          modelEvents.length === 0
            ? 0
            : Number(
                (
                  (summary.successfulRequests / modelEvents.length) *
                  100
                ).toFixed(2),
              ),
      };
    })
    .sort((a, b) => b.cost - a.cost);
}

export function getTenantAnalytics() {
  const events = listUsage();

  const groups = groupBy(events, "tenantId");

  return Object.entries(groups)
    .map(([tenantId, tenantEvents]) => {
      const summary = aggregateUsage(tenantEvents);

      return {
        tenantId,

        requests: summary.requests,

        inputTokens: summary.inputTokens,

        outputTokens: summary.outputTokens,

        totalTokens: summary.totalTokens,

        cost: Number(summary.cost.toFixed(8)),

        averageLatencyMs: calculateAverageLatency(tenantEvents),
      };
    })
    .sort((a, b) => b.cost - a.cost);
}

export function getUserAnalytics() {
  const events = listUsage();

  const groups = groupBy(events, "userId");

  return Object.entries(groups)
    .map(([userId, userEvents]) => {
      const summary = aggregateUsage(userEvents);

      return {
        userId,

        requests: summary.requests,

        totalTokens: summary.totalTokens,

        cost: Number(summary.cost.toFixed(8)),
      };
    })
    .sort((a, b) => b.cost - a.cost);
}

export function getEndpointAnalytics() {
  const events = listUsage();

  const groups = groupBy(events, "endpoint");

  return Object.entries(groups)
    .map(([endpoint, endpointEvents]) => {
      const summary = aggregateUsage(endpointEvents);

      return {
        endpoint,

        requests: summary.requests,

        totalTokens: summary.totalTokens,

        cost: Number(summary.cost.toFixed(8)),
      };
    })
    .sort((a, b) => b.cost - a.cost);
}

export function getDailyAnalytics() {
  const events = listUsage();

  const groups = {};

  for (const event of events) {
    const day = event.createdAt.slice(0, 10);

    if (!groups[day]) {
      groups[day] = [];
    }

    groups[day].push(event);
  }

  return Object.entries(groups)
    .map(([date, dayEvents]) => {
      const summary = aggregateUsage(dayEvents);

      return {
        date,

        requests: summary.requests,

        totalTokens: summary.totalTokens,

        cost: Number(summary.cost.toFixed(8)),

        averageLatencyMs: calculateAverageLatency(dayEvents),
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getMonthlyAnalytics() {
  const events = listUsage();

  const groups = {};

  for (const event of events) {
    const month = event.createdAt.slice(0, 7);

    if (!groups[month]) {
      groups[month] = [];
    }

    groups[month].push(event);
  }

  return Object.entries(groups)
    .map(([month, monthEvents]) => {
      const summary = aggregateUsage(monthEvents);

      return {
        month,

        requests: summary.requests,

        inputTokens: summary.inputTokens,

        outputTokens: summary.outputTokens,

        totalTokens: summary.totalTokens,

        providerCost: Number(summary.cost.toFixed(8)),

        averageLatencyMs: calculateAverageLatency(monthEvents),
      };
    })
    .sort((a, b) => a.month.localeCompare(b.month));
}
