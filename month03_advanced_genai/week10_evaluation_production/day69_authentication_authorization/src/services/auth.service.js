import bcrypt from "bcrypt";
import { users, refreshTokens } from "../data/store.js";
import {
  createAccessToken,
  createRefreshToken,
  rotateRefreshToken,
} from "./token.service.js";
import { AppError } from "../utils/errors.js";

export async function registerUser({
  email,
  password,
  tenantId = "tenant_a",
  role = "user",
  plan = "free",
}) {
  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = users.find((user) => user.email === normalizedEmail);

  if (existingUser) {
    throw new AppError("Unable to create account", 400);
  }

  if (!password || password.length < 8) {
    throw new AppError("Password must be at least 8 characters", 400);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = {
    id: `user_${users.length + 1}`,
    email: normalizedEmail,
    passwordHash,
    role,
    tenantId,
    plan,
  };

  users.push(user);

  return sanitizeUser(user);
}

export async function loginUser(email, password) {
  const normalizedEmail = email.toLowerCase().trim();

  const user = users.find((item) => item.email === normalizedEmail);

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    throw new AppError("Invalid credentials", 401);
  }

  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
  };
}

export function refreshUserToken(refreshToken) {
  const stored = refreshTokens.get(refreshToken);

  if (!stored) {
    throw new AppError("Invalid refresh token", 401);
  }

  const user = users.find((item) => item.id === stored.userId);

  if (!user) {
    throw new AppError("Invalid refresh token", 401);
  }

  const newRefreshToken = rotateRefreshToken(refreshToken, user);

  if (!newRefreshToken) {
    throw new AppError("Invalid refresh token", 401);
  }

  return {
    accessToken: createAccessToken(user),
    refreshToken: newRefreshToken,
  };
}

function sanitizeUser(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    tenantId: user.tenantId,
    plan: user.plan,
  };
}
