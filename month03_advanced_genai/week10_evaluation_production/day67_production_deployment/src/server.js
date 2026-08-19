import "dotenv/config";

import app from "./app.js";

import { validateEnv, config } from "./config/env.js";

/*
 * Validate environment
 * before starting server.
 */
validateEnv();

/*
 * Start HTTP server
 */
const server = app.listen(config.port, () => {
  console.log(
    JSON.stringify({
      level: "info",

      event: "server.started",

      service: "genai-api",

      port: config.port,

      environment: config.nodeEnv,

      timestamp: new Date().toISOString(),
    }),
  );
});

/*
 * Graceful shutdown
 */
function shutdown(signal) {
  console.log(
    JSON.stringify({
      level: "info",

      event: "shutdown.started",

      signal,

      timestamp: new Date().toISOString(),
    }),
  );

  /*
   * Stop accepting new connections.
   */
  server.close(() => {
    console.log(
      JSON.stringify({
        level: "info",

        event: "shutdown.completed",

        timestamp: new Date().toISOString(),
      }),
    );

    process.exit(0);
  });

  /*
   * Safety timeout.
   */
  setTimeout(() => {
    console.error(
      JSON.stringify({
        level: "error",

        event: "shutdown.timeout",
      }),
    );

    process.exit(1);
  }, 10000).unref();
}

/*
 * Linux / production termination
 */
process.on("SIGTERM", () => shutdown("SIGTERM"));

/*
 * Ctrl+C
 */
process.on("SIGINT", () => shutdown("SIGINT"));

/*
 * Unexpected synchronous error
 */
process.on("uncaughtException", (error) => {
  console.error(
    JSON.stringify({
      level: "error",

      event: "uncaught.exception",

      error: error.message,

      stack: error.stack,

      timestamp: new Date().toISOString(),
    }),
  );

  shutdown("uncaughtException");
});

/*
 * Unhandled Promise rejection
 */
process.on("unhandledRejection", (reason) => {
  console.error(
    JSON.stringify({
      level: "error",

      event: "unhandled.rejection",

      reason: String(reason),

      timestamp: new Date().toISOString(),
    }),
  );

  shutdown("unhandledRejection");
});
