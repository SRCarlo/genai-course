export const fallbackChain = {
  quality: ["provider-a", "provider-b", "provider-c"],
  balanced: ["provider-a", "provider-b"],
  fast: ["provider-a", "provider-b"]
};

export function getFallbackProviders(tier) {
  return fallbackChain[tier] || ["provider-a", "provider-b", "provider-c"];
}
