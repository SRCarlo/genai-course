import Log from "../models/Log.js";

export const getStats = async (req, res) => {
  const logs = await Log.find();

  const total = logs.length;

  const avgTime =
    logs.reduce(
      (a, b) => a + b.duration,

      0,
    ) / (total || 1);

  res.json({
    success: true,

    totalRequests: total,

    averageLatency: avgTime,
  });
};
