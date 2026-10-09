import { describe, expect, it } from "vitest";
import { InMemoryEventStore } from "../src/billing/event-store.js";
import { WebhookService } from "../src/billing/webhook.service.js";

describe("billing webhook processing", () => {
  it("activates a subscription", async () => {
    const service = new WebhookService(new InMemoryEventStore());
    await service.process({
      id: "evt_1",
      type: "subscription.activated",
      data: { tenantId: "tenant_1", subscriptionId: "sub_1", planId: "pro", version: 1 }
    });

    expect(service.subscriptions.get("tenant_1")).toMatchObject({
      subscriptionId: "sub_1", planId: "pro", status: "active", version: 1
    });
  });

  it("does not apply the same processed event twice", async () => {
    const service = new WebhookService(new InMemoryEventStore());
    const event = {
      id: "evt_duplicate",
      type: "subscription.activated",
      data: { tenantId: "tenant_1", subscriptionId: "sub_1", planId: "pro", version: 1 }
    };

    expect((await service.process(event)).processed).toBe(true);
    expect(await service.process(event)).toMatchObject({ duplicate: true, processed: true });
  });

  it("rejects an incomplete event", async () => {
    const service = new WebhookService(new InMemoryEventStore());
    await expect(service.process({ id: "evt_bad", type: "subscription.activated" }))
      .rejects.toThrow("INVALID_BILLING_EVENT");
  });

  it("does not let an older activation override a newer cancellation", async () => {
    const service = new WebhookService(new InMemoryEventStore());
    await service.process({
      id: "evt_activate", type: "subscription.activated",
      data: { tenantId: "tenant_1", subscriptionId: "sub_1", planId: "pro", version: 3 }
    });
    await service.process({
      id: "evt_cancel", type: "subscription.cancelled",
      data: { tenantId: "tenant_1", subscriptionId: "sub_1", version: 4 }
    });
    await service.process({
      id: "evt_old_activate", type: "subscription.activated",
      data: { tenantId: "tenant_1", subscriptionId: "sub_1", planId: "pro", version: 2 }
    });

    expect(service.subscriptions.get("tenant_1").status).toBe("cancelled");
  });
});
