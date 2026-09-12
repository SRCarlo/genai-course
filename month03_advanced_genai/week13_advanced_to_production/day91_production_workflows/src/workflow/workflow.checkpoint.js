export async function saveCheckpoint(state, store) {
  state.checkpoint = {
    workflowId: state.workflowId,
    currentStep: state.currentStep,
    status: state.status,
    version: state.version,
    updatedAt: new Date().toISOString()
  };

  return store.save(state);
}

export async function loadCheckpoint(workflowId, store) {
  return store.load(workflowId);
}
