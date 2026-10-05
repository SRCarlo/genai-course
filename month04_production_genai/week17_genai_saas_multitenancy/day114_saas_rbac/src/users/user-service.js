export class UserService {
  constructor({ userRegistry, roleService }) {
    this.userRegistry = userRegistry;
    this.roleService = roleService;
  }

  getMe(user) {
    return {
      id: user.id,
      email: user.email,
      tenantId: user.tenantId,
      role: user.role,
      active: user.active,
      permissions: this.roleService.getPermissions(user.role),
    };
  }

  listTenantUsers(tenantId) {
    return this.userRegistry.listByTenant(tenantId);
  }
}
