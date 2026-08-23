const usageEvents = new Map();

export function saveUsageEvent(event) {
  if (usageEvents.has(event.requestId)) {
    return {
      created: false,
      event: usageEvents.get(event.requestId),
    };
  }

  usageEvents.set(event.requestId, event);

  return {
    created: true,
    event,
  };
}

export function getUsageEvents() {
  return Array.from(usageEvents.values());
}

export function getUsageEvent(requestId) {
  return usageEvents.get(requestId);
}

export function clearUsageEvents() {
  usageEvents.clear();
}
