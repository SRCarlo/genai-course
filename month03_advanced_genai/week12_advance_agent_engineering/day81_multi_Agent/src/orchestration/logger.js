export class Logger {
  info(message, metadata = {}) {
    console.log(
      JSON.stringify({
        level: "info",

        timestamp: new Date().toISOString(),

        message,

        ...metadata,
      }),
    );
  }

  warn(message, metadata = {}) {
    console.warn(
      JSON.stringify({
        level: "warn",

        timestamp: new Date().toISOString(),

        message,

        ...metadata,
      }),
    );
  }

  error(message, metadata = {}) {
    console.error(
      JSON.stringify({
        level: "error",

        timestamp: new Date().toISOString(),

        message,

        ...metadata,
      }),
    );
  }
}

export const logger = new Logger();
