const ALLOWED_STATUSES = new Set(["pending", "running", "completed", "failed"]);

export function validatePlan(plan, options = {}) {
  const { maxSteps = 10, allowedTools = [] } = options;

  if (!plan || typeof plan !== "object") {
    throw new Error("Plan must be an object");
  }

  if (typeof plan.goal !== "string" || plan.goal.trim() === "") {
    throw new Error("Plan goal is required");
  }

  if (!Array.isArray(plan.steps)) {
    throw new Error("Plan steps must be an array");
  }

  if (plan.steps.length === 0) {
    throw new Error("Plan must contain at least one step");
  }

  if (plan.steps.length > maxSteps) {
    throw new Error(`Plan exceeds maximum allowed steps: ${maxSteps}`);
  }

  const ids = new Set();

  for (const step of plan.steps) {
    if (!Number.isInteger(step.id)) {
      throw new Error("Every step must have an integer id");
    }

    if (ids.has(step.id)) {
      throw new Error(`Duplicate step id: ${step.id}`);
    }

    ids.add(step.id);

    if (
      typeof step.description !== "string" ||
      step.description.trim() === ""
    ) {
      throw new Error(`Step ${step.id} requires a description`);
    }

    if (!ALLOWED_STATUSES.has(step.status)) {
      throw new Error(`Invalid status for step ${step.id}`);
    }

    if (step.tool !== null && typeof step.tool !== "string") {
      throw new Error(`Invalid tool for step ${step.id}`);
    }

    if (
      step.tool !== null &&
      allowedTools.length > 0 &&
      !allowedTools.includes(step.tool)
    ) {
      throw new Error(`Unauthorized tool "${step.tool}" in step ${step.id}`);
    }
  }

  return true;
}
