export async function handleWebhook(
  event,
  { idempotencyStore, billingService }
) {
  if (!event?.id || !event?.type) {
    throw new Error("INVALID_WEBHOOK_EVENT");
  }

  if (await idempotencyStore.has(event.id)) {
    return { duplicate: true };
  }

  await billingService.processEvent(event);
  await idempotencyStore.mark(event.id);

  return { duplicate: false };
}
