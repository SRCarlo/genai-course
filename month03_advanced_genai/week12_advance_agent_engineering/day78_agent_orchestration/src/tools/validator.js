export function validateToolCall(toolName, args) {
  if (!toolName) {
    throw new Error("Tool name is required");
  }

  if (!args || typeof args !== "object") {
    throw new Error("Tool arguments must be an object");
  }

  switch (toolName) {
    case "getOrder":
      if (typeof args.orderId !== "string" || !/^ORD-\d+$/.test(args.orderId)) {
        throw new Error("Invalid orderId");
      }

      break;

    case "cancelOrder":
      if (typeof args.orderId !== "string" || !/^ORD-\d+$/.test(args.orderId)) {
        throw new Error("Invalid orderId");
      }

      break;

    case "searchKnowledgeBase":
      if (typeof args.query !== "string" || args.query.trim().length === 0) {
        throw new Error("Invalid search query");
      }

      break;

    case "calculate":
      if (
        typeof args.expression !== "string" ||
        args.expression.trim().length === 0
      ) {
        throw new Error("Invalid expression");
      }

      break;

    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }

  return true;
}
