const tools = new Map();

export function registerTool(name, handler, metadata = {}) {
  tools.set(name, {
    name,
    handler,
    metadata,
  });
}

export function getTool(name) {
  return tools.get(name);
}

export function getAllTools() {
  return Array.from(tools.values());
}

registerTool(
  "get_order_status",
  async ({ orderId }) => {
    return {
      orderId,
      status: "shipped",
      estimatedDelivery: "3-5 business days",
    };
  },
  {
    description: "Returns the current order status.",
  },
);
