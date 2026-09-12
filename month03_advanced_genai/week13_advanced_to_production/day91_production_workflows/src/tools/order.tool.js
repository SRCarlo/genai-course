const ORDERS = new Map([
  ["12345", { id: "12345", userId: "user-1", amount: 4999, eligible: true, status: "delivered" }],
  ["20000", { id: "20000", userId: "user-1", amount: 25000, eligible: true, status: "delivered" }],
  ["99999", { id: "99999", userId: "user-1", amount: 1200, eligible: false, status: "delivered" }]
]);

export async function getOrder(orderId, userId) {
  const order = ORDERS.get(String(orderId));

  if (!order) {
    const error = new Error("ORDER_NOT_FOUND");
    error.code = "INVALID_ARGUMENT";
    throw error;
  }

  if (order.userId !== userId) {
    const error = new Error("ORDER_ACCESS_DENIED");
    error.code = "FORBIDDEN";
    throw error;
  }

  return structuredClone(order);
}
