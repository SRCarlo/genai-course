const allowedTools = ["calculator", "weather", "github", "search"];

export function canUseTool(toolName) {
  if (!toolName) {
    return false;
  }

  return allowedTools.includes(toolName.toLowerCase());
}
