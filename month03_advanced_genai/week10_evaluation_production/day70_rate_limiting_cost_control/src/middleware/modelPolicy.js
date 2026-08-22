import { env } from "../config/env.js";

export function modelPolicy(req, res, next) {
  const requestedModel = req.body?.model || env.GROQ_MODEL;

  const allowedModels = req.user?.plan?.allowedModels || [];

  if (!allowedModels.includes(requestedModel)) {
    return res.status(403).json({
      error: "model_not_allowed",
      message: "Your plan does not allow this model",
      requestedModel,
      allowedModels,
    });
  }

  req.model = requestedModel;

  next();
}
