import test from "node:test";
import assert from "node:assert/strict";
import { SemanticCache } from "../src/cache/semantic-cache.js";

test("semantic cache can match similar queries", () => {
  const cache = new SemanticCache({ threshold: 0.5 });

  cache.set({
    query: "What is your refund policy?",
    response: "Refunds are allowed under the refund policy.",
    tenantId: "tenant-1",
    contextVersion: "v1"
  });

  const result = cache.get({
    query: "What is your refund policy?",
    tenantId: "tenant-1",
    contextVersion: "v1"
  });

  assert.ok(result);
  assert.equal(result.response, "Refunds are allowed under the refund policy.");
});

test("semantic cache enforces tenant isolation", () => {
  const cache = new SemanticCache({ threshold: 0.5 });

  cache.set({
    query: "What is your refund policy?",
    response: "Tenant A private answer",
    tenantId: "tenant-a",
    contextVersion: "v1"
  });

  const result = cache.get({
    query: "What is your refund policy?",
    tenantId: "tenant-b",
    contextVersion: "v1"
  });

  assert.equal(result, null);
});

test("semantic cache enforces context version", () => {
  const cache = new SemanticCache({ threshold: 0.5 });

  cache.set({
    query: "What is your refund policy?",
    response: "Version 1 answer",
    tenantId: "tenant-a",
    contextVersion: "v1"
  });

  const result = cache.get({
    query: "What is your refund policy?",
    tenantId: "tenant-a",
    contextVersion: "v2"
  });

  assert.equal(result, null);
});
