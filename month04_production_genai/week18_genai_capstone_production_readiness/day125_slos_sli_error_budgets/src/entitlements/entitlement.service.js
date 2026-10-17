export class EntitlementService {
  constructor(subscriptionRepository) {
    this.subscriptionRepository = subscriptionRepository;
  }

  async requireFeature(tenantId, feature) {
    if (!tenantId || !feature) throw new Error('INVALID_ENTITLEMENT_REQUEST');

    const subscription = await this.subscriptionRepository.findByTenantId(tenantId);
    if (!subscription || subscription.status !== 'active') {
      throw new Error('SUBSCRIPTION_ACCESS_DENIED');
    }

    if (subscription.features?.[feature] !== true) {
      throw new Error('FEATURE_NOT_ENTITLED');
    }

    return subscription;
  }
}
