export async function checkRefundEligibility({ orderId }) {
  if (orderId === "99999") {
    return {
      success: true,

      eligible: false,

      reason: "Cancelled orders do not require a refund request.",
    };
  }

  return {
    success: true,

    eligible: true,

    reason: "Order is within the refund eligibility period.",
  };
}
