import nodemailer from "nodemailer";
import { env } from "../config/env.js";

let transporterInstance = null;

function createTransporter() {
  if (transporterInstance) {
    return transporterInstance;
  }

  if (!env.SMTP_USER || !env.SMTP_PASS) {
    throw new Error("SMTP credentials are missing in environment variables");
  }

  transporterInstance = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS
    }
  });

  return transporterInstance;
}

export async function sendMail({ to, subject, html, text }) {
  const transporter = createTransporter();

  const info = await transporter.sendMail({
    from: `"CoreInventory" <${env.SMTP_USER}>`,
    to,
    subject,
    text,
    html
  });

  return info;
}

export async function sendPasswordResetOtpEmail({ to, otp }) {
  const subject = "CoreInventory Password Reset OTP";

  const text = `Your CoreInventory password reset OTP is ${otp}. It will expire in 10 minutes. If you did not request this, please ignore this email.`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px;">
      <h2 style="margin: 0 0 12px; color: #111827;">Reset your password</h2>
      <p style="margin: 0 0 16px; color: #4b5563; font-size: 14px; line-height: 1.6;">
        We received a request to reset your CoreInventory password.
      </p>
      <p style="margin: 0 0 10px; color: #374151; font-size: 14px;">Use this OTP to continue:</p>
      <div style="margin: 16px 0 20px; padding: 16px; text-align: center; background: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 12px;">
        <span style="font-size: 28px; letter-spacing: 8px; font-weight: 700; color: #7c3aed;">${otp}</span>
      </div>
      <p style="margin: 0 0 10px; color: #4b5563; font-size: 14px; line-height: 1.6;">
        This OTP will expire in <strong>10 minutes</strong>.
      </p>
      <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.6;">
        If you did not request a password reset, you can safely ignore this email.
      </p>
    </div>
  `;

  return sendMail({
    to,
    subject,
    text,
    html
  });
}
