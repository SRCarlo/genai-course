import crypto from "crypto";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { refreshTokens } from "../data/store.js";

export function createAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
      tenantId: user.tenantId,
      plan: user.plan,
      type: "access",
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn,
      issuer: "day69-api",
      audience: "day69-client",
    },
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.jwtSecret, {
    issuer: "day69-api",
    audience: "day69-client",
  });
}

export function createRefreshToken(user) {
  const token = crypto.randomBytes(48).toString("hex");

  refreshTokens.set(token, {
    userId: user.id,
    createdAt: Date.now(),
  });

  return token;
}

export function rotateRefreshToken(oldToken, user) {
  const stored = refreshTokens.get(oldToken);

  if (!stored) {
    return null;
  }

  if (stored.userId !== user.id) {
    return null;
  }

  refreshTokens.delete(oldToken);

  return createRefreshToken(user);
}

export function revokeRefreshToken(token) {
  refreshTokens.delete(token);
}
