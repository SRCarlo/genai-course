function timestamp() {
  return new Date().toISOString();
}

export const logger = {
  info(message, metadata = {}) {
    console.log(
      JSON.stringify({
        level: "info",
        timestamp: timestamp(),
        message,
        ...metadata,
      }),
    );
  },

  warn(message, metadata = {}) {
    console.warn(
      JSON.stringify({
        level: "warn",
        timestamp: timestamp(),
        message,
        ...metadata,
      }),
    );
  },

  error(message, metadata = {}) {
    console.error(
      JSON.stringify({
        level: "error",
        timestamp: timestamp(),
        message,
        ...metadata,
      }),
    );
  },
};
