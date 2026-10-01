export async function fallback(primaryTask, fallbackTask) {
  try {
    return { ...(await primaryTask()), provider: "primary", fallback: false };
  } catch (primaryError) {
    try {
      return {
        ...(await fallbackTask()),
        provider: "fallback",
        fallback: true,
      };
    } catch {
      throw new Error("Both primary and fallback providers failed");
    }
  }
}
