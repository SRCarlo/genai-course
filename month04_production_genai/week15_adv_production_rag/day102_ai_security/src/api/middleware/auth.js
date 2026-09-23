import { users } from "../../data/users.js";

export function requireUser(req, res, next) {
  const userId = req.header("x-user-id");

  if (!userId) {
    return res.status(401).json({
      error: "Authentication required",
    });
  }

  const user = users.find((item) => item.id === userId);

  if (!user) {
    return res.status(401).json({
      error: "Unknown user",
    });
  }

  req.user = user;
  next();
}
