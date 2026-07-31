import User from "../models/User.js";

export const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,

        message: "User not found",
      });
    }

    let limit;

    // Plan limits

    if (user.plan === "free") {
      limit = 100;
    } else if (user.plan === "pro") {
      limit = 5000;
    } else {
      limit = "Unlimited";
    }

    let remaining;

    if (limit === "Unlimited") {
      remaining = "Unlimited";
    } else {
      remaining = limit - user.usage;
    }

    res.json({
      success: true,

      dashboard: {
        name: user.name,

        email: user.email,

        plan: user.plan,

        usage: user.usage,

        limit,

        remaining,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
