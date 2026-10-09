const ALLOWED_PLANS = new Set(["starter", "pro"]);

export class WebhookService {
  constructor(eventStore) {
    this.eventStore = eventStore;
    this.subscriptions = new Map();
  }

  async process(event, provider = "mock") {
    if (
      !event ||
      typeof event.id !== "string" ||
      !event.id ||
      typeof event.type !== "string" ||
      !event.type ||
      !event.data ||
      typeof event.data !== "object" ||
      Array.isArray(event.data)
    ) {
      throw new Error("INVALID_BILLING_EVENT");
    }

    const received = await this.eventStore.recordReceived(provider, event);
    if (received.duplicate && received.event.status === "processed") {
      return { duplicate: true, processed: false };
    }
    if (received.duplicate && received.event.status === "processing") {
      return { duplicate: true, processing: true };
    }

    await this.eventStore.markProcessing(provider, event.id);

    try {
      switch (event.type) {
        case "subscription.activated": {
          const { tenantId, subscriptionId, planId, version } = event.data;
          if (
            typeof tenantId !== "string" ||
            typeof subscriptionId !== "string" ||
            !ALLOWED_PLANS.has(planId)
          ) {
            throw new Error("INVALID_SUBSCRIPTION_EVENT");
          }

          const current = this.subscriptions.get(tenantId);
          const incomingVersion = Number.isInteger(version) ? version : 0;

          // Ignore stale activation events after a newer transition.
          if (current && incomingVersion < current.version) break;

          this.subscriptions.set(tenantId, {
            subscriptionId,
            planId,
            status: "active",
            version: incomingVersion
          });
          break;
        }

        case "subscription.cancelled": {
          const { tenantId, subscriptionId, version } = event.data;
          if (typeof tenantId !== "string" || !tenantId) {
            throw new Error("INVALID_SUBSCRIPTION_EVENT");
          }

          const current = this.subscriptions.get(tenantId);
          const incomingVersion = Number.isInteger(version) ? version : 0;
          if (current && subscriptionId && current.subscriptionId !== subscriptionId) break;
          if (current && incomingVersion < current.version) break;

          if (current) {
            this.subscriptions.set(tenantId, {
              ...current,
              status: "cancelled",
              version: incomingVersion
            });
          }
          break;
        }

        case "payment.failed":
          // Production: persist payment failure and schedule a retry/dunning workflow.
          break;

        default:
          // Unknown events are recorded and safely acknowledged by this learning adapter.
          break;
      }

      await this.eventStore.markProcessed(provider, event.id);
      return { duplicate: false, processed: true };
    } catch (error) {
      await this.eventStore.markFailed(provider, event.id, error);
      throw error;
    }
  }
}
