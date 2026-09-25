import test from "node:test";
import assert from "node:assert/strict";
import {
  disableAI,
  enableAI,
  isAIEnabled,
  requireAIEnabled,
} from "../../src/security/kill-switch.js";

test("kill switch disables AI requests", () => {
  enableAI();
  assert.equal(isAIEnabled(), true);

  disableAI();

  assert.equal(isAIEnabled(), false);
  assert.throws(
    () => requireAIEnabled(),
    /AI functionality temporarily disabled/,
  );

  enableAI();
});
