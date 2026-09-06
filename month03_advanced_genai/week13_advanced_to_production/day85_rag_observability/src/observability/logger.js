function write(level, event, data = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    event,
    ...data
  };

  console.log(JSON.stringify(entry));
}

export const logger = {
  info(event, data) {
    write("info", event, data);
  },

  warn(event, data) {
    write("warn", event, data);
  },

  error(event, data) {
    write("error", event, data);
  }
};