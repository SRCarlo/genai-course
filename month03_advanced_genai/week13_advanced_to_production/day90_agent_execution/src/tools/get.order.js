const orders = {
  12345: {
    orderId: "12345",
    status: "delivered",
    amount: 2499,
    deliveredAt: "2026-09-08",
  },

  99999: {
    orderId: "99999",
    status: "cancelled",
    amount: 999,
    deliveredAt: null,
  },
};

export async function getOrder({ orderId }) {
  const order = orders[orderId];

  if (!order) {
    const error = new Error(`Order ${orderId} not found`);

    error.code = "ORDER_NOT_FOUND";

    throw error;
  }

  return {
    success: true,
    order,
  };
}
