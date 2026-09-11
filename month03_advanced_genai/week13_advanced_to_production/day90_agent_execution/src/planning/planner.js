import { validatePlan } from "./plan.schema.js";

export function createDeterministicPlan(goal) {
  const orderMatch = goal.match(/order\s*#?\s*([A-Za-z0-9-]+)/i);

  const orderId = orderMatch?.[1] || "12345";

  const plan = [
    {
      id: "step-1",
      tool: "getOrder",
      arguments: {
        orderId,
      },
      status: "pending",
      dependsOn: [],
    },

    {
      id: "step-2",
      tool: "checkRefundEligibility",
      arguments: {
        orderId,
      },
      status: "pending",
      dependsOn: ["step-1"],
    },

    {
      id: "step-3",
      tool: "refundOrder",
      arguments: {
        orderId,
        reason: "Customer requested refund",
      },
      status: "pending",
      dependsOn: ["step-2"],
    },
  ];

  return validatePlan(plan);
}
