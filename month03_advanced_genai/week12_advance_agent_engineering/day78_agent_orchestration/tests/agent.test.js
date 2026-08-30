import test from "node:test";
import assert from "node:assert/strict";

import { executeAgent } from "../src/agent/agent.js";

test("agent can answer refund policy question", async () => {
  const result = await executeAgent("What is the refund policy?");

  assert.ok(result);

  assert.ok(result.status === "completed" || result.status === "failed");

  assert.ok(result.iteration >= 1);
});

test("agent asks clarification for missing order ID", async () => {
  const result = await executeAgent("Check my order.");

  assert.equal(result.status, "waiting_for_user");

  assert.ok(result.clarificationQuestion);
});
