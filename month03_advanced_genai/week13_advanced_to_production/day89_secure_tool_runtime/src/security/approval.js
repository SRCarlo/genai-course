export async function requireHumanApproval({
  toolName,
  arguments: args,
  approval = false
}) {
  if (!approval) {
    return {
      approved: false,
      required: true,
      tool: toolName,
      arguments: args
    };
  }

  return {
    approved: true,
    required: true,
    tool: toolName,
    arguments: args
  };
}