export const logRequest = (endpoint, duration) => {
  console.log({
    endpoint,
    duration,
    timestamp: new Date(),
  });
};
import Log from "../models/Log.js";

export const saveLog = async ({
  endpoint,
  method,
  duration,
  status,
  prompt,
  response,
}) => {
  try {
    await Log.create({
      endpoint,
      method,
      duration,
      status,
      prompt,
      response,
    });
  } catch (err) {
    console.log(err.message);
  }
};
