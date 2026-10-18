export class TenantAccessService {
  constructor(membershipRepository) {
    this.membershipRepository = membershipRepository;
  }

  async requireMembership({ userId, tenantId }) {
    if (!userId || !tenantId) {
      throw new Error('AUTHENTICATION_REQUIRED');
    }

    const membership = await this.membershipRepository.findMembership({ userId, tenantId });
    if (!membership || !['owner', 'admin', 'member'].includes(membership.role)) {
      throw new Error('TENANT_ACCESS_DENIED');
    }

    return membership;
  }
}
