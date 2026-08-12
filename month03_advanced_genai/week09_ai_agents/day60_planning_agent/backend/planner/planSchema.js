export const STEP_STATUSES = {
  PENDING: "pending",
  RUNNING: "running",
  COMPLETED: "completed",
  FAILED: "failed",
};

export function createPlan(goal, steps = []) {
  return {
    goal,

    steps: steps.map((step, index) => ({
      id: step.id ?? index + 1,

      description: step.description ?? "",

      tool: step.tool ?? null,

      input: step.input ?? null,

      status: STEP_STATUSES.PENDING,

      result: null,

      error: null,

      retries: 0,
    })),
  };
}
