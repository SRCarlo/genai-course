import crypto from "crypto";

export function createWorkflowState(task) {
  return {
    workflowId: crypto.randomUUID(),

    task,

    research: {
      node: null,
      spring: null,
      fastapi: null,
    },

    analysis: null,

    review: null,

    finalAnswer: null,

    status: "created",

    startedAt: new Date().toISOString(),

    trace: [],
  };
}
