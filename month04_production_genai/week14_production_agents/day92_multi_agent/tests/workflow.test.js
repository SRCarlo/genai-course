import { createWorkflowState } from "../src/workflow/workflow.state.js";

import { WorkflowBudget } from "../src/policies/budget.js";

describe("Workflow", () => {
  test("creates workflow state", () => {
    const state = createWorkflowState("Compare Node.js and Spring Boot");

    expect(state.workflowId).toBeDefined();

    expect(state.task).toBe("Compare Node.js and Spring Boot");

    expect(state.status).toBe("created");
  });

  test("budget blocks excessive LLM calls", () => {
    const budget = new WorkflowBudget({
      maxLLMCalls: 2,
    });

    budget.incrementLLMCalls();

    budget.incrementLLMCalls();

    expect(() => budget.incrementLLMCalls()).toThrow("WORKFLOW_LIMIT_EXCEEDED");
  });
});
