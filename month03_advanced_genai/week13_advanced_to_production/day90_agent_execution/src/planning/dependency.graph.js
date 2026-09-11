export const toolDependencies = {
  getOrder: [],

  checkRefundEligibility: ["getOrder"],

  refundOrder: ["checkRefundEligibility"],
};

export function validateDependencies(plan) {
  const completed = new Set();

  for (const step of plan) {
    if (step.status === "completed") {
      completed.add(step.tool);
    }
  }

  return plan.every((step) => {
    const dependencies = toolDependencies[step.tool] || [];

    return dependencies.every(
      (dependency) =>
        completed.has(dependency) ||
        plan.some(
          (candidate) =>
            candidate.tool === dependency && candidate.status === "completed",
        ),
    );
  });
}

export function getReadySteps(plan) {
  const completedStepIds = new Set(
    plan.filter((step) => step.status === "completed").map((step) => step.id),
  );

  return plan.filter((step) => {
    if (step.status !== "pending") {
      return false;
    }

    return step.dependsOn.every((dependency) =>
      completedStepIds.has(dependency),
    );
  });
}
