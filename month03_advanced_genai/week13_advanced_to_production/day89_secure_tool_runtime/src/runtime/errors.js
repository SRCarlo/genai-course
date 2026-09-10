export const ToolErrors = {
  NOT_FOUND: "TOOL_NOT_FOUND",

  NOT_AUTHORIZED: "TOOL_NOT_AUTHORIZED",

  INVALID_ARGUMENTS: "TOOL_INVALID_ARGUMENTS",

  INVALID_RESULT: "TOOL_INVALID_RESULT",

  TIMEOUT: "TOOL_TIMEOUT",

  EXECUTION_FAILED: "TOOL_EXECUTION_FAILED",

  APPROVAL_REQUIRED: "HUMAN_APPROVAL_REQUIRED",

  APPROVAL_REJECTED: "HUMAN_APPROVAL_REJECTED",

  MAX_CALLS: "AGENT_MAX_TOOL_CALLS"
};

export class ToolRuntimeError extends Error {
  constructor(code, message, details = null) {
    super(message);

    this.name = "ToolRuntimeError";
    this.code = code;
    this.details = details;
  }
}