import { TOOL_PERMISSIONS } from "../ai/tool-permissions.js";

export class PermissionService {
  constructor({ roleService }) {
    this.roleService = roleService;
  }

  check(user, permission) {
    return this.roleService.hasPermission(user.role, permission);
  }

  toolPermission(tool) {
    return TOOL_PERMISSIONS[tool] ?? null;
  }
}
