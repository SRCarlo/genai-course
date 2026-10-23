const test = require("node:test");
const assert = require("node:assert/strict");

const { createResponseCacheKey } = require("../src/cache/cache-key");
const { createMemoryCache } = require("../src/cache/memory-cache");

test("returns cached value before TTL expires", () => {
  let currentTime = 1000;

  const cache = createMemoryCache({
    defaultTtlMs: 100,
    now: () => currentTime,
  });

  cache.set("key-1", "cached answer");

  currentTime = 1050;
  assert.equal(cache.get("key-1"), "cached answer");

  currentTime = 1101;
  assert.equal(cache.get("key-1"), undefined);
});

test("supports explicit cache invalidation", () => {
  const cache = createMemoryCache();

  cache.set("key-1", "cached answer");

  assert.equal(cache.del("key-1"), true);
  assert.equal(cache.get("key-1"), undefined);
});

test("isolates cache keys by tenant", () => {
  const common = {
    authorizationScope: "student",
    question: "What is AI?",
    model: "test-model",
    promptVersion: "v1",
    indexVersion: "v1",
  };

  const tenantAKey = createResponseCacheKey({
    ...common,
    tenantId: "tenant-A",
  });

  const tenantBKey = createResponseCacheKey({
    ...common,
    tenantId: "tenant-B",
  });

  assert.notEqual(tenantAKey, tenantBKey);
});

test("normalizes question whitespace", () => {
  const common = {
    tenantId: "tenant-A",
    authorizationScope: "student",
    model: "test-model",
    promptVersion: "v1",
    indexVersion: "v1",
  };

  const firstKey = createResponseCacheKey({
    ...common,
    question: "What   is AI?",
  });

  const secondKey = createResponseCacheKey({
    ...common,
    question: "  What is AI?  ",
  });

  assert.equal(firstKey, secondKey);
});

test("changes cache key when prompt version changes", () => {
  const common = {
    tenantId: "tenant-A",
    authorizationScope: "student",
    question: "What is AI?",
    model: "test-model",
    indexVersion: "v1",
  };

  const v1Key = createResponseCacheKey({
    ...common,
    promptVersion: "v1",
  });

  const v2Key = createResponseCacheKey({
    ...common,
    promptVersion: "v2",
  });

  assert.notEqual(v1Key, v2Key);
});

test("changes cache key when index version changes", () => {
  const common = {
    tenantId: "tenant-A",
    authorizationScope: "student",
    question: "What is AI?",
    model: "test-model",
    promptVersion: "v1",
  };

  const v1Key = createResponseCacheKey({
    ...common,
    indexVersion: "index-v1",
  });

  const v2Key = createResponseCacheKey({
    ...common,
    indexVersion: "index-v2",
  });

  assert.notEqual(v1Key, v2Key);
});

test("isolates cache keys by authorization scope", () => {
  const common = {
    tenantId: "tenant-A",
    question: "What is AI?",
    model: "test-model",
    promptVersion: "v1",
    indexVersion: "v1",
  };

  const studentKey = createResponseCacheKey({
    ...common,
    authorizationScope: "student",
  });

  const adminKey = createResponseCacheKey({
    ...common,
    authorizationScope: "admin",
  });

  assert.notEqual(studentKey, adminKey);
});
