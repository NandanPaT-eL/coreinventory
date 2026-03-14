import User from "../models/User.model.js";
import { generateAccessToken } from "../utils/jwt.js";
import {
  generateOtp,
  canResendOtp,
  saveOtp,
  verifyOtp,
  deleteOtp
} from "../utils/otp.js";
import { sendPasswordResetOtpEmail } from "../utils/mailer.js";

const allowedRoles = ["admin", "manager", "staff"];

export async function signUp(req, res) {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email"
      });
    }

    const userRole = allowedRoles.includes(role) ? role : "manager";

    const user = await User.create({
      name,
      email,
      password,
      role: userRole
    });

    const token = generateAccessToken(user);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Signup failed",
      error: error.message
    });
  }
}

export async function signIn(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "User account is inactive"
      });
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = generateAccessToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Signin failed",
      error: error.message
    });
  }
}

export async function getMe(req, res) {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Current user fetched successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch current user",
      error: error.message
    });
  }
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with this email"
      });
    }

    const resendAllowed = await canResendOtp(email);

    if (!resendAllowed) {
      return res.status(429).json({
        success: false,
        message: "Please wait before requesting another OTP"
      });
    }

    const otp = generateOtp();

    await saveOtp(email, otp);
    await sendPasswordResetOtpEmail({
      to: email,
      otp
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message
    });
  }
}

export async function resetPassword(req, res) {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with this email"
      });
    }

    const otpVerification = await verifyOtp(email, otp);

    if (!otpVerification.isValid) {
      return res.status(400).json({
        success: false,
        message: otpVerification.reason
      });
    }

    user.password = newPassword;
    await user.save();

    await deleteOtp(email);

    return res.status(200).json({
      success: true,
      message: "Password reset successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to reset password",
      error: error.message
    });
  }
}
