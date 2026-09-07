export function log(level, event, data = {}) {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),

      level,

      event,

      ...data,
    }),
  );
}

export const logger = {
  info(event, data) {
    log("INFO", event, data);
  },

  warn(event, data) {
    log("WARN", event, data);
  },

  error(event, data) {
    log("ERROR", event, data);
  },
};
