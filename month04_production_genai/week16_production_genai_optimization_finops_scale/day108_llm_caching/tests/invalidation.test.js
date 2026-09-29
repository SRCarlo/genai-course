import test from "node:test";
import assert from "node:assert/strict";
import { createVersionedKey } from "../src/cache/invalidation.js";

test("different versions create different keys", () => {
  const v1 = createVersionedKey("faq", "v1", "abc123");
  const v2 = createVersionedKey("faq", "v2", "abc123");

  assert.equal(v1, "faq:v1:abc123");
  assert.equal(v2, "faq:v2:abc123");
  assert.notEqual(v1, v2);
});

test("same version and hash create same key", () => {
  const first = createVersionedKey("faq", "v1", "abc123");
  const second = createVersionedKey("faq", "v1", "abc123");

  assert.equal(first, second);
});
