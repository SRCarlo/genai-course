import test from "node:test";
import assert from "node:assert/strict";

import { WorkflowStore } from "../src/storage/workflow.store.js";
import { createWorkflowState } from "../src/workflow/workflow.state.js";
import { runWorkflow } from "../src/workflow/workflow.runner.js";
import { resumeWorkflow } from "../src/workflow/workflow.recovery.js";

test("resumes a waiting workflow after approval", async () => {
  const store = new WorkflowStore();

  const state = createWorkflowState({
    workflowId: "wf-recovery",
    userId: "user-1",
    orderId: "20000",
    goal: "Refund"
  });

  await store.create(state);

  const deps = {
    store,
    maxRetries: 1,
    policy: { threshold: 10000 },
    agent: {
      decide: async () => ({
        action: "request_refund",
        reason: "eligible",
        confidence: 1,
        source: "test"
      })
    }
  };

  const waiting = await runWorkflow(state, deps);
  assert.equal(waiting.status, "waiting_approval");

  waiting.approvals[0].status = "approved";
  const approvalStep = waiting.steps.find(s => s.id === "approval");
  approvalStep.status = "completed";
  await store.save(waiting);

  const resumed = await resumeWorkflow(waiting.workflowId, store, deps);

  assert.equal(resumed.status, "completed");
});
