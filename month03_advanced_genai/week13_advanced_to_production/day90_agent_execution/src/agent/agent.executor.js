import { getTool } from "../tools/tool.registry.js";

import { authorizeTool } from "../security/authorization.js";

import { requiresHumanApproval } from "../security/risk.policy.js";

import { createApprovalRequest } from "../security/approval.js";

import { withRetry } from "../execution/retry.js";

import { withTimeout } from "../execution/timeout.js";

import { assertToolBudget } from "../execution/budget.js";

import {
  addObservation,
  addToolCall,
  addError,
} from "../memory/task.memory.js";

export async function executeStep({ state, step, tracer }) {
  assertToolBudget(state);

  tracer.start("tool.start", {
    tool: step.tool,
    stepId: step.id,
  });

  authorizeTool({
    toolName: step.tool,
  });

  const tool = getTool(step.tool);

  if (requiresHumanApproval(step.tool)) {
    const autoApprove = process.env.AUTO_APPROVE_DEMO === "true";

    if (!autoApprove) {
      const approval = createApprovalRequest({
        requestId: state.metadata.requestId,

        toolName: step.tool,

        arguments: step.arguments,
      });

      state.status = "waiting_for_approval";

      state.pendingApproval = approval;

      tracer.complete("tool.waiting_for_approval", {
        approvalId: approval.approvalId,
      });

      return {
        status: "waiting_for_approval",

        approval,
      };
    }
  }

  const idempotencyKey = `${state.metadata.requestId}-${step.id}`;

  const argumentsWithIdempotency = {
    ...step.arguments,

    idempotencyKey,
  };

  const startedAt = Date.now();

  try {
    const result = await withRetry(
      () => withTimeout(tool.execute(argumentsWithIdempotency), 10000),
      {
        retries: 2,
      },
    );

    const durationMs = Date.now() - startedAt;

    addToolCall(state, {
      stepId: step.id,
      tool: step.tool,
      status: "completed",
      durationMs,
    });

    addObservation(state, {
      stepId: step.id,
      tool: step.tool,
      result,
      durationMs,
    });

    step.status = "completed";

    tracer.complete("tool.complete", {
      tool: step.tool,
      durationMs,
    });

    return {
      status: "completed",
      result,
    };
  } catch (error) {
    step.status = "failed";

    addToolCall(state, {
      stepId: step.id,
      tool: step.tool,
      status: "failed",
    });

    addError(state, error);

    tracer.error("tool.execute", error);

    throw error;
  }
}
