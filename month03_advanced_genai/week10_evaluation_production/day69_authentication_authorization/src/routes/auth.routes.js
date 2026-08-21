import express from "express";
import {
  loginUser,
  registerUser,
  refreshUserToken,
} from "../services/auth.service.js";
import { validateLogin, validateRegister } from "../middleware/validate.js";
import { AppError } from "../utils/errors.js";

const router = express.Router();

router.post("/register", validateRegister, async (req, res, next) => {
  try {
    const user = await registerUser({
      email: req.body.email,
      password: req.body.password,
    });

    res.status(201).json({
      user,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", validateLogin, async (req, res, next) => {
  try {
    const result = await loginUser(req.body.email, req.body.password);

    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/refresh", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError("Refresh token required", 401);
    }

    const result = refreshUserToken(refreshToken);

    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
