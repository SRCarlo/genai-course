export class InMemorySubscriptionRepository {
  #subscriptions = new Map();

  async findByTenantId(tenantId) {
    return this.#subscriptions.get(tenantId) ?? null;
  }

  async save(subscription) {
    if (
      !subscription ||
      typeof subscription.tenantId !== "string" ||
      !subscription.tenantId.trim() ||
      typeof subscription.planId !== "string" ||
      !subscription.planId.trim()
    ) {
      throw new Error("INVALID_SUBSCRIPTION");
    }

    const record = {
      status: "active",
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      ...subscription
    };

    this.#subscriptions.set(record.tenantId, record);
    return record;
  }

  async deleteAllForTests() {
    this.#subscriptions.clear();
  }
}
