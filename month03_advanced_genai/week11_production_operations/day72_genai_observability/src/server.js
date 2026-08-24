import app from "./app.js";

import { env, validateProductionConfig } from "./config/env.js";

import { logger } from "./middleware/logger.js";

validateProductionConfig();

const server = app.listen(env.port, () => {
  logger.info("Server started", {
    port: env.port,

    environment: env.nodeEnv,

    model: env.groqModel,
  });
});

function shutdown(signal) {
  logger.info("Shutdown signal received", {
    signal,
  });

  server.close(() => {
    logger.info("HTTP server closed");

    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("SIGINT", () => shutdown("SIGINT"));
