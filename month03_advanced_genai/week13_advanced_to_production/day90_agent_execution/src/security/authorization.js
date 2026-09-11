const allowedTools = new Set([
  "getOrder",
  "checkRefundEligibility",
  "refundOrder",
]);

export function authorizeTool({ toolName }) {
  if (!allowedTools.has(toolName)) {
    const error = new Error(`Tool '${toolName}' is not authorized`);

    error.code = "UNAUTHORIZED_TOOL";

    throw error;
  }

  return true;
}
