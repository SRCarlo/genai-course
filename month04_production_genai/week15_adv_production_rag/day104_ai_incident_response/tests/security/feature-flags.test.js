import test from "node:test";
import assert from "node:assert/strict";
import {
  getFeatures,
  isFeatureEnabled,
  requireFeature,
  setFeature,
} from "../../src/security/feature-flags.js";

test("feature flags can be enabled and disabled", () => {
  setFeature("tools", false);
  assert.equal(isFeatureEnabled("tools"), false);
  assert.throws(() => requireFeature("tools"), /Feature "tools" is disabled/);

  setFeature("tools", true);
  assert.equal(isFeatureEnabled("tools"), true);

  assert.deepEqual(Object.keys(getFeatures()).sort(), [
    "externalSearch",
    "rag",
    "tools",
  ]);
});
