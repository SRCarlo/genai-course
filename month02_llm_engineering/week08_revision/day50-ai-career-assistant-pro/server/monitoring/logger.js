export const logRequest = (endpoint, duration) => {
  console.log({
    endpoint,
    duration,
    timestamp: new Date(),
  });
};
