import test from "node:test";
import assert from "node:assert/strict";

import { SemanticCache } from "../../src/cost/semantic-cache.js";

test("semantic cache respects tenant scope", () => {
  const cache = new SemanticCache();

  cache.set({
    tenantId: "tenant-a",
    userScope: "user-1",
    query: "What is AI?",
    response: "AI means Artificial Intelligence.",
  });

  const sameTenant = cache.get({
    tenantId: "tenant-a",
    userScope: "user-1",
    query: "What is AI?",
  });

  assert.equal(sameTenant.cached, true);
  assert.equal(sameTenant.response, "AI means Artificial Intelligence.");

  const differentTenant = cache.get({
    tenantId: "tenant-b",
    userScope: "user-1",
    query: "What is AI?",
  });

  assert.equal(differentTenant, null);
});
