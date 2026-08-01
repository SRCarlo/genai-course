export default function usageLimit(req, res, next) {
  const user = req.user;

  let limit = 100;

  if (user.plan === "pro") {
    limit = 5000;
  }

  if (user.plan !== "enterprise" && user.usage >= limit) {
    return res.status(403).json({
      message: "Usage limit reached. Upgrade your plan.",
    });
  }

  next();
}
