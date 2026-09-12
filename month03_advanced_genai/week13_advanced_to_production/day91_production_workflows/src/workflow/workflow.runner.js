import { StepStatus, WorkflowStatus } from "./workflow.state.js";
import { saveCheckpoint } from "./workflow.checkpoint.js";
import { withRetry } from "./workflow.retry.js";
import { agentDecisionStep } from "../agent/agent.step.js";
import { evaluateRefundPolicy } from "../approval/approval.policy.js";
import { requestApproval } from "../approval/approval.service.js";
import { getOrder } from "../tools/order.tool.js";
import { refundOrder } from "../tools/refund.tool.js";
import { notifyUser } from "../tools/notification.tool.js";

const STEP_TIMEOUT_MS = 30_000;

function timeoutError() {
  const error = new Error("STEP_TIMEOUT");
  error.code = "TIMEOUT";
  error.retryable = true;
  return error;
}

async function withTimeout(promise, ms = STEP_TIMEOUT_MS) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(timeoutError()), ms);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timer);
  }
}

async function executeStep(step, state, dependencies) {
  const { store } = dependencies;
  step.status = StepStatus.RUNNING;
  step.attempts += 1;

  const operation = async () => {
    switch (step.id) {
      case "get-order": {
        const order = await getOrder(state.orderId, state.userId);
        state.observations.push({
          type: "order",
          data: order,
          at: new Date().toISOString()
        });
        return order;
      }

      case "agent-decision":
        return agentDecisionStep(state, dependencies);

      case "policy-check": {
        const order = state.observations.find(x => x.type === "order")?.data;
        const policy = evaluateRefundPolicy(order, state.agentDecision, dependencies.policy);
        state.observations.push({
          type: "policy",
          data: policy,
          at: new Date().toISOString()
        });
        return policy;
      }

      case "approval": {
        const policy = state.observations.find(x => x.type === "policy")?.data;

        if (!policy?.eligible) {
          step.status = StepStatus.SKIPPED;
          return { skipped: true, reason: policy?.reason };
        }

        if (!policy.approvalRequired) {
          step.status = StepStatus.SKIPPED;
          return { skipped: true, reason: "Approval not required." };
        }

        const existing = state.approvals.at(-1);
        if (!existing) {
          const approval = await requestApproval({
            workflowId: state.workflowId,
            reason: policy.reason,
            amount: state.observations.find(x => x.type === "order")?.data?.amount
          });

          state.approvals.push(approval);
          state.status = WorkflowStatus.WAITING_APPROVAL;
          step.status = StepStatus.WAITING_APPROVAL;
          return approval;
        }

        if (existing.status === "approved") return existing;
        if (existing.status === "rejected") {
          state.status = WorkflowStatus.CANCELLED;
          throw new Error("APPROVAL_REJECTED");
        }

        state.status = WorkflowStatus.WAITING_APPROVAL;
        step.status = StepStatus.WAITING_APPROVAL;
        return existing;
      }

      case "refund": {
        const policy = state.observations.find(x => x.type === "policy")?.data;

        if (!policy?.eligible) {
          step.status = StepStatus.SKIPPED;
          return { skipped: true, reason: "Refund not eligible." };
        }

        if (policy.approvalRequired && state.approvals.at(-1)?.status !== "approved") {
          state.status = WorkflowStatus.WAITING_APPROVAL;
          step.status = StepStatus.WAITING_APPROVAL;
          return state.approvals.at(-1);
        }

        const order = state.observations.find(x => x.type === "order")?.data;
        return refundOrder({
          order,
          idempotencyKey: `${state.workflowId}:refund`,
          store
        });
      }

      case "notify": {
        const refund = state.steps.find(x => x.id === "refund")?.result;
        if (!refund || refund.skipped) {
          step.status = StepStatus.SKIPPED;
          return { skipped: true, reason: "No refund was executed." };
        }

        return notifyUser({
          userId: state.userId,
          message: `Refund ${refund.refundId} completed for order ${refund.orderId}.`
        });
      }

      default:
        throw new Error(`UNKNOWN_STEP:${step.id}`);
    }
  };

  const result = await withRetry(
    () => withTimeout(operation()),
    {
      maxRetries: dependencies.maxRetries,
      onRetry: ({ attempt, delay, error }) => {
        state.audit.push({
          event: "StepRetry",
          stepId: step.id,
          attempt,
          delay,
          error: error.message,
          at: new Date().toISOString()
        });
      }
    }
  );

  if (step.status === StepStatus.RUNNING) {
    step.status = StepStatus.COMPLETED;
  }

  step.result = result;
  step.error = null;

  state.audit.push({
    event: "StepCompleted",
    stepId: step.id,
    at: new Date().toISOString()
  });

  return result;
}

export async function runWorkflow(state, dependencies) {
  if ([WorkflowStatus.COMPLETED, WorkflowStatus.CANCELLED].includes(state.status)) {
    return state;
  }

  state.status = WorkflowStatus.RUNNING;

  while (state.currentStep < state.steps.length) {
    const step = state.steps[state.currentStep];

    if (step.status === StepStatus.COMPLETED || step.status === StepStatus.SKIPPED) {
      state.currentStep += 1;
      continue;
    }

    if (step.status === StepStatus.WAITING_APPROVAL) {
      if (state.approvals.at(-1)?.status !== "approved") {
        state.status = WorkflowStatus.WAITING_APPROVAL;
        await saveCheckpoint(state, dependencies.store);
        return state;
      }
    }

    try {
      await executeStep(step, state, dependencies);

      if (state.status === WorkflowStatus.WAITING_APPROVAL) {
        await saveCheckpoint(state, dependencies.store);
        return state;
      }

      state.currentStep += 1;
      await saveCheckpoint(state, dependencies.store);
    } catch (error) {
      step.status = StepStatus.FAILED;
      step.error = error.message;
      state.lastError = error.message;
      state.errors.push({
        stepId: step.id,
        message: error.message,
        at: new Date().toISOString()
      });

      if (error.message === "APPROVAL_REJECTED") {
        state.status = WorkflowStatus.CANCELLED;
      } else {
        state.status = WorkflowStatus.FAILED;
      }

      await saveCheckpoint(state, dependencies.store);
      return state;
    }
  }

  state.status = WorkflowStatus.COMPLETED;
  state.audit.push({
    event: "WorkflowCompleted",
    at: new Date().toISOString()
  });

  await saveCheckpoint(state, dependencies.store);
  return state;
}
