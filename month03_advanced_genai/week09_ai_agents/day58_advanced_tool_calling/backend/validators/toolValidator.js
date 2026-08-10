export function validateToolArguments(schema, args) {
  if (!schema) {
    return {
      valid: false,
      error: "Tool schema not found",
    };
  }

  if (args === null || typeof args !== "object" || Array.isArray(args)) {
    return {
      valid: false,
      error: "Tool arguments must be an object",
    };
  }

  const parameters = schema.function?.parameters || {};

  const properties = parameters.properties || {};

  const required = parameters.required || [];

  for (const field of required) {
    if (args[field] === undefined || args[field] === null) {
      return {
        valid: false,
        error: `Missing required argument: ${field}`,
      };
    }
  }

  for (const [field, definition] of Object.entries(properties)) {
    if (args[field] === undefined) {
      continue;
    }

    if (definition.type === "string" && typeof args[field] !== "string") {
      return {
        valid: false,
        error: `${field} must be a string`,
      };
    }

    if (definition.type === "number" && typeof args[field] !== "number") {
      return {
        valid: false,
        error: `${field} must be a number`,
      };
    }

    if (definition.type === "boolean" && typeof args[field] !== "boolean") {
      return {
        valid: false,
        error: `${field} must be a boolean`,
      };
    }
  }

  if (parameters.additionalProperties === false) {
    const allowedFields = new Set(Object.keys(properties));

    for (const field of Object.keys(args)) {
      if (!allowedFields.has(field)) {
        return {
          valid: false,
          error: `Unknown argument: ${field}`,
        };
      }
    }
  }

  return {
    valid: true,
  };
}
