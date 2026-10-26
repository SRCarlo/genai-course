"use strict";

function estimateCacheSavings({
  cacheHits,
  estimatedAvoidedProviderCost,
}) {
  if (!Number.isInteger(cacheHits) || cacheHits < 0) {
    throw new TypeError("cacheHits must be a non-negative integer");
  }

  if (
    !Number.isFinite(estimatedAvoidedProviderCost) ||
    estimatedAvoidedProviderCost < 0
  ) {
    throw new TypeError(
      "estimatedAvoidedProviderCost must be non-negative"
    );
  }

  return {
    cacheHits,
    estimatedAvoidedProviderCost,
    method: "estimated",
  };
}

module.exports = { estimateCacheSavings };
