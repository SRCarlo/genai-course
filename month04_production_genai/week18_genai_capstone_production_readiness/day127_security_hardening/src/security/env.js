export function loadSecurityConfig(env = process.env) {
  const apiKey = env.LLM_API_KEY?.trim();
  if (!apiKey) throw new Error("Missing required configuration: LLM_API_KEY");
  if (apiKey.length < 20) throw new Error("LLM_API_KEY does not meet the configured minimum length");
  return Object.freeze({ llmApiKey: apiKey, nodeEnv: env.NODE_ENV ?? "development" });
}
