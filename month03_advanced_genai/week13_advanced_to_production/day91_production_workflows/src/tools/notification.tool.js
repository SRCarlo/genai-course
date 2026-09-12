export async function notifyUser({ userId, message }) {
  return {
    userId,
    channel: "console",
    message,
    sentAt: new Date().toISOString()
  };
}
