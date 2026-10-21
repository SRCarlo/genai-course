function loadConfig(env = process.env) {
  const port = Number(env.PORT ?? 3000);
  const nodeEnv = env.NODE_ENV ?? "development";
  const logLevel = env.LOG_LEVEL ?? "info";

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer from 1 to 65535");
  }

  if (!["development", "test", "production"].includes(nodeEnv)) {
    throw new Error("NODE_ENV is invalid");
  }

  if (!["debug", "info", "warn", "error"].includes(logLevel)) {
    throw new Error("LOG_LEVEL is invalid");
  }

  if (nodeEnv === "production" && !env.LLM_API_KEY) {
    throw new Error("LLM_API_KEY is required in production");
  }

  return Object.freeze({
    port,
    nodeEnv,
    logLevel,
    isProduction: nodeEnv === "production",
  });
}

module.exports = { loadConfig };
