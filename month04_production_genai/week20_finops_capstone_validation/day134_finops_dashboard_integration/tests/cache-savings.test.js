"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  estimateCacheSavings,
} = require("../src/finops/cache-savings");

test("returns the supplied estimated savings", () => {
  assert.deepEqual(
    estimateCacheSavings({
      cacheHits: 10,
      estimatedAvoidedProviderCost: 0.25,
    }),
    {
      cacheHits: 10,
      estimatedAvoidedProviderCost: 0.25,
      method: "estimated",
    }
  );
});

test("rejects invalid cache hit counts", () => {
  assert.throws(
    () =>
      estimateCacheSavings({
        cacheHits: -1,
        estimatedAvoidedProviderCost: 0.1,
      }),
    /cacheHits/
  );
});

test("rejects negative estimated savings", () => {
  assert.throws(
    () =>
      estimateCacheSavings({
        cacheHits: 1,
        estimatedAvoidedProviderCost: -0.1,
      }),
    /non-negative/
  );
});
