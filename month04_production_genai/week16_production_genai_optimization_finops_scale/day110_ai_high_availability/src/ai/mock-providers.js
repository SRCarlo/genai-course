export function createHealthyProvider(response = "Fallback response") {
  return {
    async generate() {
      return { text: response, model: "mock-fallback-model" };
    },
  };
}
export function createFailingProvider(message = "Provider unavailable") {
  return {
    async generate() {
      throw new Error(message);
    },
  };
}
