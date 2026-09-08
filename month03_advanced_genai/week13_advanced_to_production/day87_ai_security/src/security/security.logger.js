export function securityLog(event) {
  const entry = {
    timestamp: new Date().toISOString(),
    type: "SECURITY_EVENT",
    ...event
  };

  console.log(JSON.stringify(entry));
  return entry;
}
