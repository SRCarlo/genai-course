import Log from "../models/Log.js";

export const getLogs = async (req, res) => {
  const logs = await Log.find().sort({
    createdAt: -1,
  });

  res.json({
    success: true,

    count: logs.length,

    logs,
  });
};
