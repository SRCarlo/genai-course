import User from "../models/User.js";

export const usageLimit = (limit) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      // Check usage limit

      if (user.usage >= limit) {
        return res.status(403).json({
          success: false,

          message: "AI usage limit exceeded. Upgrade your plan.",
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,

        message: error.message,
      });
    }
  };
};
