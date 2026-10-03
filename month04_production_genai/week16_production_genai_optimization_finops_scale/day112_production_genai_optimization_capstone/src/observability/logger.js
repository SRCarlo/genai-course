export function log(event, data = {}) {
  console.log(
    JSON.stringify({ timestamp: new Date().toISOString(), event, ...data }),
  );
}
