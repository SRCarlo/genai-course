import test from "node:test";
import assert from "node:assert/strict";
import {
  createCacheKey,
  hashRequest
} from "../src/cache/cache-key.js";

const base = {
  tenantId: "tenant-1",
  model: "openai/gpt-oss-20b",
  promptVersion: "v1",
  contextVersion: "v1",
  query: "hello"
};

test("same input creates same hash", () => {
  assert.equal(hashRequest(base), hashRequest(base));
});

test("property ordering does not change hash", () => {
  assert.equal(
    hashRequest({ model: "A", prompt: "hello" }),
    hashRequest({ prompt: "hello", model: "A" })
  );
});

test("different tenants create different keys", () => {
  assert.notEqual(
    createCacheKey(base),
    createCacheKey({ ...base, tenantId: "tenant-2" })
  );
});

test("different model creates different key", () => {
  assert.notEqual(
    createCacheKey(base),
    createCacheKey({ ...base, model: "model-b" })
  );
});

test("different prompt version creates different key", () => {
  assert.notEqual(
    createCacheKey(base),
    createCacheKey({ ...base, promptVersion: "v2" })
  );
});

test("different context version creates different key", () => {
  assert.notEqual(
    createCacheKey(base),
    createCacheKey({ ...base, contextVersion: "v2" })
  );
});
