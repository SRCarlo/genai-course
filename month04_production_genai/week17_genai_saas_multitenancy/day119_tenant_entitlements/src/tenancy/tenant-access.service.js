export class TenantAccessService {
  constructor(memberships = []) {
    this.memberships = memberships.map(membership => ({ ...membership }));
  }

  async canAccessTenant({ userId, tenantId }) {
    if (!userId || !tenantId) return false;

    return this.memberships.some(membership =>
      membership.userId === userId &&
      membership.tenantId === tenantId &&
      membership.status === "active"
    );
  }
}
