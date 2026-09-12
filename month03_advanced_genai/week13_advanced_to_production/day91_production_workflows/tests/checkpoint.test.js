import test from "node:test";
import assert from "node:assert/strict";

import { WorkflowStore } from "../src/storage/workflow.store.js";
import { createWorkflowState } from "../src/workflow/workflow.state.js";
import { saveCheckpoint, loadCheckpoint } from "../src/workflow/workflow.checkpoint.js";

test("saves and loads a workflow checkpoint", async () => {
  const store = new WorkflowStore();
  const state = createWorkflowState({
    workflowId: "wf-checkpoint",
    userId: "user-1",
    orderId: "12345",
    goal: "Refund"
  });

  await store.create(state);
  state.currentStep = 2;
  state.status = "running";

  await saveCheckpoint(state, store);
  const restored = await loadCheckpoint(state.workflowId, store);

  assert.equal(restored.currentStep, 2);
  assert.equal(restored.checkpoint.currentStep, 2);
});
