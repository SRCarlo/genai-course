export const WEBHOOK_EVENT_TYPES = new Set([
  "subscription.updated",
  "invoice.paid",
  "payment.failed",
  "subscription.cancelled"
]);

export function validateWebhookEvent(event) {
  return Boolean(
    event &&
    typeof event.id === "string" &&
    typeof event.type === "string" &&
    WEBHOOK_EVENT_TYPES.has(event.type)
  );
}
