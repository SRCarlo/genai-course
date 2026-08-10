export const timeTool = {
  async execute() {
    const now = new Date();

    return {
      iso: now.toISOString(),
      local: now.toString(),
      timestamp: now.getTime(),
    };
  },
};
