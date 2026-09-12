export function evaluateRefundPolicy(order, decision, {
  threshold = Number(process.env.REFUND_APPROVAL_THRESHOLD || 10000)
} = {}) {
  if (decision.action !== "request_refund") {
    return {
      eligible: false,
      approvalRequired: false,
      reason: "Agent decided that a refund should not be requested."
    };
  }

  if (!order.eligible) {
    return {
      eligible: false,
      approvalRequired: false,
      reason: "Order is not eligible for refund."
    };
  }

  return {
    eligible: true,
    approvalRequired: Number(order.amount) > threshold,
    threshold,
    reason: Number(order.amount) > threshold
      ? `Refund exceeds ₹${threshold}; human approval is required.`
      : "Refund is eligible under the normal threshold."
  };
}
