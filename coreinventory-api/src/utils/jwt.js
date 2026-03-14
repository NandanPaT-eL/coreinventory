import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function generateAccessToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role
    },
    env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.JWT_SECRET);
}
