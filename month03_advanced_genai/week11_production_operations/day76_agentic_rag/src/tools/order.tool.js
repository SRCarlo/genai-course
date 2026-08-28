const orders = {
  "ORD-123": {
    orderId: "ORD-123",
    customerId: "CUS-001",
    status: "delayed",
    amount: 50000,
    currency: "INR",
    cancellationRequested: true,
    reason: "Carrier delay",
  },

  "ORD-456": {
    orderId: "ORD-456",
    customerId: "CUS-002",
    status: "delivered",
    amount: 25000,
    currency: "INR",
    cancellationRequested: false,
    reason: null,
  },

  "ORD-789": {
    orderId: "ORD-789",
    customerId: "CUS-003",
    status: "processing",
    amount: 85000,
    currency: "INR",
    cancellationRequested: false,
    reason: null,
  },
};

export async function getOrder(orderId) {
  if (typeof orderId !== "string") {
    throw new Error("orderId must be a string.");
  }

  const order = orders[orderId];

  if (!order) {
    return {
      success: false,
      error: "ORDER_NOT_FOUND",
    };
  }

  return {
    success: true,
    order,
  };
}
