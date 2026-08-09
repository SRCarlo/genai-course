export const timeTool = {
  name: "getCurrentTime",

  description: "Get the current time in Indian Standard Time (IST).",

  schema: {
    type: "object",
    properties: {},
    required: [],
  },

  async execute() {
    const time = new Date().toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    return {
      time: `${time} IST`,
    };
  },
};
