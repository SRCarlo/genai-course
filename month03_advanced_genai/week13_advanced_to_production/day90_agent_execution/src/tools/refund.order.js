const processedRefunds = new Map();

export async function refundOrder({ orderId, reason, idempotencyKey }) {
  if (!idempotencyKey) {
    const error = new Error("Idempotency key is required");

    error.code = "MISSING_IDEMPOTENCY_KEY";

    throw error;
  }

  if (processedRefunds.has(idempotencyKey)) {
    return {
      success: true,

      duplicate: true,

      ...processedRefunds.get(idempotencyKey),
    };
  }

  const refund = {
    orderId,

    refunded: true,

    reason,

    refundId: `refund-${crypto.randomUUID()}`,

    processedAt: new Date().toISOString(),
  };

  processedRefunds.set(idempotencyKey, refund);

  return {
    success: true,

    duplicate: false,

    ...refund,
  };
}
