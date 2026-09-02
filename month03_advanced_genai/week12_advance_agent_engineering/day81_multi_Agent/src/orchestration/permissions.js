export const PERMISSIONS = {
  RESEARCH: "research",

  WRITE_CODE: "write_code",

  REVIEW_CODE: "review_code",

  SECURITY_REVIEW: "security_review",

  PERFORMANCE_REVIEW: "performance_review",

  AGGREGATE: "aggregate",

  DEPLOY: "deploy",

  DELETE: "delete",
};

export function can(agent, permission) {
  return agent.permissions.includes(permission);
}

export function requirePermission(agent, permission) {
  if (!can(agent, permission)) {
    throw new Error(
      `Agent '${agent.name}' does not have permission '${permission}'`,
    );
  }

  return true;
}
