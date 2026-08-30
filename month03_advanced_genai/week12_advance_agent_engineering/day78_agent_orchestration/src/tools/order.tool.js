const orders = {
  "ORD-1001": {
    orderId: "ORD-1001",
    customerId: "CUST-001",
    status: "shipped",
    amount: 5000,
    currency: "INR",
    item: "Wireless Headphones",
    refundable: true,
  },

  "ORD-1002": {
    orderId: "ORD-1002",
    customerId: "CUST-002",
    status: "delivered",
    amount: 2500,
    currency: "INR",
    item: "Keyboard",
    refundable: false,
  },

  "ORD-1003": {
    orderId: "ORD-1003",
    customerId: "CUST-003",
    status: "processing",
    amount: 1200,
    currency: "INR",
    item: "Mouse",
    refundable: true,
  },
};

export async function getOrder({ orderId }) {
  if (!orderId) {
    throw new Error("orderId is required");
  }

  const order = orders[orderId];

  if (!order) {
    const error = new Error(`Order ${orderId} was not found`);

    error.code = "NOT_FOUND";

    throw error;
  }

  return order;
}

export async function cancelOrder({ orderId }) {
  if (!orderId) {
    throw new Error("orderId is required");
  }

  const order = orders[orderId];

  if (!order) {
    const error = new Error(`Order ${orderId} was not found`);

    error.code = "NOT_FOUND";

    throw error;
  }

  return {
    orderId,
    status: "cancellation_pending_approval",
    message: "Cancellation requires human approval.",
  };
}
