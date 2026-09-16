const permissions = {
  getOrder: ["user", "authenticated-user", "admin"],
  searchKnowledge: ["user", "authenticated-user", "admin"],
  getCustomer: ["user", "authenticated-user", "admin"],
  updateCustomer: ["authenticated-user", "admin"]
};

export function canExecute(toolName, role) {
  return permissions[toolName]?.includes(role) ?? false;
}

export function getPermissions() {
  return structuredClone(permissions);
}
