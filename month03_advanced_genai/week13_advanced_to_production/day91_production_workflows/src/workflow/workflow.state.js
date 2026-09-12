export const WorkflowStatus = Object.freeze({
  PENDING: "pending",
  RUNNING: "running",
  WAITING_APPROVAL: "waiting_approval",
  WAITING_EXTERNAL: "waiting_external",
  FAILED: "failed",
  COMPLETED: "completed",
  CANCELLED: "cancelled"
});

export const StepStatus = Object.freeze({
  PENDING: "pending",
  RUNNING: "running",
  WAITING_APPROVAL: "waiting_approval",
  COMPLETED: "completed",
  FAILED: "failed",
  SKIPPED: "skipped"
});

export function createWorkflowState({ workflowId, userId, goal, orderId }) {
  const now = new Date().toISOString();

  return {
    workflowId,
    userId,
    goal,
    orderId,
    status: WorkflowStatus.PENDING,
    currentStep: 0,
    version: 1,
    steps: [
      { id: "get-order", type: "tool", status: StepStatus.PENDING, attempts: 0, result: null, error: null },
      { id: "agent-decision", type: "agent", status: StepStatus.PENDING, attempts: 0, result: null, error: null },
      { id: "policy-check", type: "policy", status: StepStatus.PENDING, attempts: 0, result: null, error: null },
      { id: "approval", type: "human", status: StepStatus.PENDING, attempts: 0, result: null, error: null },
      { id: "refund", type: "tool", status: StepStatus.PENDING, attempts: 0, result: null, error: null },
      { id: "notify", type: "tool", status: StepStatus.PENDING, attempts: 0, result: null, error: null }
    ],
    observations: [],
    approvals: [],
    events: [],
    errors: [],
    compensation: [],
    agentDecision: null,
    checkpoint: null,
    audit: [],
    createdAt: now,
    updatedAt: now,
    lastError: null
  };
}
