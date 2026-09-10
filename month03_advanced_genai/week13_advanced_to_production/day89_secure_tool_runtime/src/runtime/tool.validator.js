export function validateToolArguments(tool, args) {
  return tool.inputSchema.parse(args);
}

export function validateToolResult(tool, result) {
  return tool.outputSchema.parse(result);
}