import app from "./app.js";

import { config } from "./config/config.js";

import { logger } from "./infrastructure/observability/logger.js";

const server = app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`, {
    environment: config.environment,
  });
});

function shutdown(signal) {
  logger.info(`${signal} received. Shutting down...`);

  server.close(() => {
    logger.info("Server closed.");

    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("SIGINT", () => shutdown("SIGINT"));
