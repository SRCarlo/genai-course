import test from "node:test";
import assert from "node:assert/strict";

import { ModelRegistry } from "../src/models/model-registry.js";
import { ModelRouter } from "../src/router/model-router.js";

test("low complexity selects fast tier", () => {
  const router = new ModelRouter(new ModelRegistry());

  const result = router.select({
    task: "classification",
    complexity: "low"
  });

  assert.equal(result.tier, "fast");
});

test("chat selects balanced tier", () => {
  const router = new ModelRouter(new ModelRegistry());

  const result = router.select({
    task: "chat",
    complexity: "medium"
  });

  assert.equal(result.tier, "balanced");
});

test("high complexity selects quality tier", () => {
  const router = new ModelRouter(new ModelRegistry());

  const result = router.select({
    task: "reasoning",
    complexity: "high"
  });

  assert.equal(result.tier, "quality");
});

test("tools requirement only selects capable models", () => {
  const router = new ModelRouter(new ModelRegistry());

  const result = router.select({
    task: "agent",
    complexity: "high",
    requiresTools: true,
    requiredCapabilities: { tools: true }
  });

  assert.equal(result.capabilities.tools, true);
});
