import test from "node:test";
import assert from "node:assert/strict";

import { WorkflowStore } from "../src/storage/workflow.store.js";
import { createWorkflowState, WorkflowStatus } from "../src/workflow/workflow.state.js";
import { runWorkflow } from "../src/workflow/workflow.runner.js";

function dependencies(store) {
  return {
    store,
    maxRetries: 1,
    policy: { threshold: 10000 },
    agent: {
      decide: async ({ order }) => ({
        action: order.eligible ? "request_refund" : "deny_refund",
        reason: "Test decision",
        confidence: 1,
        source: "test"
      })
    }
  };
}

test("completes a normal refund workflow", async () => {
  const store = new WorkflowStore();
  const state = createWorkflowState({
    workflowId: "wf-test-1",
    userId: "user-1",
    orderId: "12345",
    goal: "Refund order 12345"
  });

  await store.create(state);
  const result = await runWorkflow(state, dependencies(store));

  assert.equal(result.status, WorkflowStatus.COMPLETED);
  assert.equal(result.steps.find(s => s.id === "refund").result.status, "refunded");
});

test("waits for human approval for a high-value refund", async () => {
  const store = new WorkflowStore();
  const state = createWorkflowState({
    workflowId: "wf-test-2",
    userId: "user-1",
    orderId: "20000",
    goal: "Refund order 20000"
  });

  await store.create(state);
  const result = await runWorkflow(state, dependencies(store));

  assert.equal(result.status, WorkflowStatus.WAITING_APPROVAL);
  assert.equal(result.approvals[0].status, "pending");
});

test("skips refund for an ineligible order", async () => {
  const store = new WorkflowStore();
  const state = createWorkflowState({
    workflowId: "wf-test-3",
    userId: "user-1",
    orderId: "99999",
    goal: "Refund order 99999"
  });

  await store.create(state);
  const result = await runWorkflow(state, dependencies(store));

  assert.equal(result.status, WorkflowStatus.COMPLETED);
  assert.equal(result.steps.find(s => s.id === "refund").status, "skipped");
});

test("idempotency prevents duplicate refunds", async () => {
  const store = new WorkflowStore();
  const { refundOrder } = await import("../src/tools/refund.tool.js");

  const order = { id: "12345", amount: 4999 };
  const first = await refundOrder({
    order,
    idempotencyKey: "wf-idem:refund",
    store
  });

  const second = await refundOrder({
    order,
    idempotencyKey: "wf-idem:refund",
    store
  });

  assert.equal(first.refundId, second.refundId);
  assert.equal(second.duplicate, true);
});
