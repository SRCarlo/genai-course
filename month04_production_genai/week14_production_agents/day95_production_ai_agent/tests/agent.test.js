import test from "node:test";
import assert from "node:assert/strict";
import { plan } from "../src/agent/planner.js";
import { runAgent } from "../src/agent/agent.js";

test("planner routes order requests to getOrder", () => {
  const result = plan("What is the status of ORD-1001?");
  assert.equal(result.tool, "getOrder");
  assert.equal(result.args.orderId, "ORD-1001");
});

test("planner routes policy requests to knowledge", () => {
  const result = plan("What is the refund policy?");
  assert.equal(result.tool, "searchKnowledge");
});

test("agent returns an answer and trace", async () => {
  const result = await runAgent({
    input: "What is the status of ORD-1001?",
    sessionId: "test-agent"
  });

  assert.ok(result.answer);
  assert.ok(result.trace.traceId);
  assert.equal(result.trace.status, "success");
});

test("agent safely handles unauthorized update", async () => {
  const result = await runAgent({
    input: "Update CUST-001 email to new@example.com",
    role: "user",
    customerId: "CUST-001",
    sessionId: "test-security"
  });

  assert.match(result.answer, /couldn't complete|couldn't/i);
  assert.equal(result.trace.status, "error");
});
