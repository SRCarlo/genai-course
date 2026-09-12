import { WorkflowStatus } from "./workflow.state.js";
import { runWorkflow } from "./workflow.runner.js";

export async function resumeWorkflow(workflowId, store, dependencies) {
  const state = await store.load(workflowId);

  if (!state) {
    throw new Error("WORKFLOW_NOT_FOUND");
  }

  if (state.status === WorkflowStatus.COMPLETED ||
      state.status === WorkflowStatus.CANCELLED) {
    return state;
  }

  return runWorkflow(state, dependencies);
}

export async function cancelWorkflow(workflowId, store) {
  const state = await store.load(workflowId);

  if (!state) {
    throw new Error("WORKFLOW_NOT_FOUND");
  }

  state.status = WorkflowStatus.CANCELLED;
  state.lastError = "Cancelled by user";
  state.audit.push({
    event: "WorkflowCancelled",
    at: new Date().toISOString()
  });

  return store.save(state);
}
