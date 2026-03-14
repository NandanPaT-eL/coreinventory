import crypto from "crypto";
import { getRedisClient } from "../config/redis.js";

const OTP_PREFIX = "password_reset_otp";
const OTP_EXPIRY_SECONDS = 10 * 60; // 10 minutes
const OTP_RESEND_COOLDOWN_SECONDS = 60; // 1 minute

function getOtpKey(email) {
  return `${OTP_PREFIX}:${email.toLowerCase().trim()}`;
}

function getCooldownKey(email) {
  return `${OTP_PREFIX}:cooldown:${email.toLowerCase().trim()}`;
}

export function generateOtp(length = 6) {
  const digits = "0123456789";
  let otp = "";

  for (let i = 0; i < length; i += 1) {
    const randomIndex = crypto.randomInt(0, digits.length);
    otp += digits[randomIndex];
  }

  return otp;
}

export async function canResendOtp(email) {
  const redis = getRedisClient();
  const cooldownKey = getCooldownKey(email);

  const exists = await redis.get(cooldownKey);

  return !exists;
}

export async function saveOtp(email, otp) {
  const redis = getRedisClient();
  const otpKey = getOtpKey(email);
  const cooldownKey = getCooldownKey(email);

  await redis.set(otpKey, otp, "EX", OTP_EXPIRY_SECONDS);
  await redis.set(cooldownKey, "1", "EX", OTP_RESEND_COOLDOWN_SECONDS);

  return {
    expiresInSeconds: OTP_EXPIRY_SECONDS,
    resendAvailableInSeconds: OTP_RESEND_COOLDOWN_SECONDS
  };
}

export async function verifyOtp(email, otp) {
  const redis = getRedisClient();
  const otpKey = getOtpKey(email);

  const storedOtp = await redis.get(otpKey);

  if (!storedOtp) {
    return {
      isValid: false,
      reason: "OTP expired or not found"
    };
  }

  if (storedOtp !== String(otp).trim()) {
    return {
      isValid: false,
      reason: "Invalid OTP"
    };
  }

  return {
    isValid: true,
    reason: "OTP verified successfully"
  };
}

export async function deleteOtp(email) {
  const redis = getRedisClient();
  const otpKey = getOtpKey(email);

  await redis.del(otpKey);
}

export async function getOtpTtl(email) {
  const redis = getRedisClient();
  const otpKey = getOtpKey(email);

  const ttl = await redis.ttl(otpKey);
  return ttl;
}
