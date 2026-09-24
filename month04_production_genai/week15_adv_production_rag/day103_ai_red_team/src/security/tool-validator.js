const schemas = {
  searchDocuments: ["query"],
  getUserProfile: ["userId"],
  deleteDocument: ["documentId"],
  sendEmail: ["to", "subject", "body"]
};

const permissions = {
  searchDocuments: { allowed: true, confirmation: false },
  getUserProfile: { allowed: true, confirmation: false },
  deleteDocument: { allowed: false, confirmation: true },
  sendEmail: { allowed: false, confirmation: true }
};

export function validateToolCall(toolName, args = {}) {
  const required = schemas[toolName];
  if (!required) return false;

  return required.every(key =>
    Object.prototype.hasOwnProperty.call(args, key)
  );
}

export function authorizeToolCall(toolName, user = {}) {
  const policy = permissions[toolName];
  if (!policy) return { allowed: false, reason: "UNKNOWN_TOOL" };

  if (!policy.allowed && !user.canUseHighImpactTools) {
    return {
      allowed: false,
      reason: "AUTHORIZATION_REQUIRED",
      confirmationRequired: policy.confirmation
    };
  }

  return {
    allowed: true,
    confirmationRequired: policy.confirmation
  };
}

export function validateAndAuthorizeToolCall(toolName, args, user) {
  if (!validateToolCall(toolName, args)) {
    return { allowed: false, reason: "INVALID_ARGUMENTS" };
  }

  return authorizeToolCall(toolName, user);
}
