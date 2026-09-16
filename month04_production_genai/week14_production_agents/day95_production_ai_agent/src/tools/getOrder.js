const orders = {
  "ORD-1001": {
    id: "ORD-1001",
    status: "shipped",
    deliveryDate: "2026-09-20"
  },
  "ORD-1002": {
    id: "ORD-1002",
    status: "processing",
    deliveryDate: null
  },
  "ORD-1003": {
    id: "ORD-1003",
    status: "delivered",
    deliveryDate: "2026-09-14"
  }
};

export async function getOrder({ orderId }) {
  if (!orderId) return null;
  return orders[orderId] ?? null;
}

export function resetOrders() {
  // Mock data is static for this learning project.
}
