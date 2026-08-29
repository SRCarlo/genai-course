const orders = {
  "ORD-1001": {
    orderId: "ORD-1001",
    status: "shipped",
    amount: 5000,
    currency: "INR",
  },

  "ORD-1002": {
    orderId: "ORD-1002",
    status: "delivered",
    amount: 8500,
    currency: "INR",
  },
};

export async function getOrder({ orderId }) {
  const order = orders[orderId];

  if (!order) {
    return {
      success: false,
      error: "Order not found",
    };
  }

  return {
    success: true,
    data: order,
  };
}
