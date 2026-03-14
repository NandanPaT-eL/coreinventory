import User from "../models/User.model.js";
import { generateAccessToken } from "../utils/jwt.js";

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
