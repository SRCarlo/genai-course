const workflows = new Map();

export function saveWorkflow(state) {
  workflows.set(
    state.workflowId,

    structuredClone(state),
  );

  return state;
}

export function getWorkflow(workflowId) {
  return workflows.get(workflowId);
}

export function listWorkflows() {
  return Array.from(workflows.values());
}
