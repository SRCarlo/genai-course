import test from "node:test";
import assert from "node:assert/strict";
import { CacheService } from "../src/cache/cache-service.js";

test("CacheService stores and retrieves a value", () => {
  const cache = new CacheService();
  cache.set("test-key", "test-value", 10_000);
  assert.equal(cache.get("test-key"), "test-value");
});

test("CacheService returns null for missing key", () => {
  const cache = new CacheService();
  assert.equal(cache.get("missing"), null);
});

test("CacheService deletes a value", () => {
  const cache = new CacheService();
  cache.set("test-key", "test-value");
  cache.delete("test-key");
  assert.equal(cache.get("test-key"), null);
});

test("CacheService clears all values", () => {
  const cache = new CacheService();
  cache.set("a", "1");
  cache.set("b", "2");
  cache.clear();
  assert.equal(cache.size(), 0);
});

test("CacheService expires values using TTL", async () => {
  const cache = new CacheService();
  cache.set("short-lived", "value", 50);
  assert.equal(cache.get("short-lived"), "value");
  await new Promise(resolve => setTimeout(resolve, 70));
  assert.equal(cache.get("short-lived"), null);
});

test("CacheService evicts least recently used entry when full", () => {
  const cache = new CacheService({ maxEntries: 2 });
  cache.set("a", "1");
  cache.set("b", "2");
  cache.get("a");
  cache.set("c", "3");

  assert.equal(cache.get("a"), "1");
  assert.equal(cache.get("b"), null);
  assert.equal(cache.get("c"), "3");
});
