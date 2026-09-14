export const tools = {
  getOrderStatus: async ({ orderId }) => ({
    orderId,
    status: "shipped",
    estimatedDelivery: "2026-09-16"
  }),

  searchDocumentation: async ({ query }) => ({
    query,
    results: [
      {
        title: "Node.js Documentation",
        snippet: "Node.js is a JavaScript runtime environment."
      }
    ]
  })
};

export function toolDefinitions() {
  return [
    {
      type: "function",
      function: {
        name: "getOrderStatus",
        description: "Get the status of an order. Use only when the user asks for order status.",
        parameters: {
          type: "object",
          properties: {
            orderId: { type: "string" }
          },
          required: ["orderId"],
          additionalProperties: false
        }
      }
    },
    {
      type: "function",
      function: {
        name: "searchDocumentation",
        description: "Search technical documentation.",
        parameters: {
          type: "object",
          properties: {
            query: { type: "string" }
          },
          required: ["query"],
          additionalProperties: false
        }
      }
    }
  ];
}
