export async function refundOrder({ order, idempotencyKey, store }) {
  const existing = await store.getIdempotency(idempotencyKey);

  if (existing) {
    return {
      ...existing,
      duplicate: true
    };
  }

  // Simulated payment provider call.
  const result = {
    refundId: `ref_${Date.now()}`,
    orderId: order.id,
    amount: order.amount,
    status: "refunded",
    idempotencyKey,
    createdAt: new Date().toISOString()
  };

  await store.setIdempotency(idempotencyKey, result);
  return result;
}
