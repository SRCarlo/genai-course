import User from "../models/User.js";

export const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    let limit = 100;

    if (user.plan === "pro") {
      limit = 5000;
    }

    if (user.plan === "enterprise") {
      limit = "Unlimited";
    }

    res.json({
      name: user.name,

      email: user.email,

      plan: user.plan,

      usage: user.usage,

      limit: limit,

      remaining: limit === "Unlimited" ? "Unlimited" : limit - user.usage,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
