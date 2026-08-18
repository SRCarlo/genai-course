import {
  isToolAllowed,
  getToolPolicy,
  requiresHumanApproval,
} from "../policies/toolPolicy.js";

export function validateToolCall({ toolName, arguments: toolArguments }) {
  if (typeof toolName !== "string" || !toolName.trim()) {
    return {
      allowed: false,
      reason: "Invalid tool name",
    };
  }

  if (!isToolAllowed(toolName)) {
    return {
      allowed: false,
      reason: "Tool not allowed",
    };
  }

  if (toolArguments === null || typeof toolArguments !== "object") {
    return {
      allowed: false,
      reason: "Tool arguments must be an object",
    };
  }

  const policy = getToolPolicy(toolName);

  if (!policy) {
    return {
      allowed: false,
      reason: "Tool policy not found",
    };
  }

  return {
    allowed: true,
    requiresApproval: requiresHumanApproval(toolName),
    risk: policy.risk,
  };
}

export function validateToolArguments({ toolName, arguments: args }) {
  if (!args || typeof args !== "object") {
    return {
      valid: false,
      reason: "Arguments must be an object",
    };
  }

  switch (toolName) {
    case "knowledge_search":
      if (typeof args.query !== "string" || !args.query.trim()) {
        return {
          valid: false,
          reason: "knowledge_search requires a query",
        };
      }

      if (args.query.length > 1000) {
        return {
          valid: false,
          reason: "Search query is too long",
        };
      }

      return {
        valid: true,
        arguments: {
          query: args.query.trim(),
        },
      };

    case "calculator":
      if (typeof args.expression !== "string") {
        return {
          valid: false,
          reason: "calculator requires an expression",
        };
      }

      if (args.expression.length > 500) {
        return {
          valid: false,
          reason: "Expression is too long",
        };
      }

      /*
       * Deliberately restrict calculator syntax.
       * Do not use eval() on arbitrary model-generated strings.
       */
      if (!/^[0-9+\-*/().%\s]+$/.test(args.expression)) {
        return {
          valid: false,
          reason: "Calculator expression contains unsupported characters",
        };
      }

      return {
        valid: true,
        arguments: {
          expression: args.expression.trim(),
        },
      };

    default:
      return {
        valid: false,
        reason: `No argument validator exists for ${toolName}`,
      };
  }
}

export function authorizeToolExecution({ user, toolName }) {
  /*
   * This is intentionally simple for Day 66.
   *
   * In production, authorization should be based on
   * authenticated identity, roles, tenant, resource ownership,
   * and server-side policy.
   */

  if (!user) {
    return {
      authorized: false,
      reason: "Authentication required",
    };
  }

  const validation = validateToolCall({
    toolName,
    arguments: {},
  });

  if (!validation.allowed) {
    return {
      authorized: false,
      reason: validation.reason,
    };
  }

  return {
    authorized: true,
  };
}
