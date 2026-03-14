import { Router } from "express";
import { signUp, signIn, getMe } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { signUpSchema, signInSchema } from "../validators/auth.validator.js";

const router = Router();

/*
--------------------------------------------------
Public Routes
--------------------------------------------------
*/

// Register new user
router.post("/signup", validate(signUpSchema), signUp);

// Login user
router.post("/signin", validate(signInSchema), signIn);


/*
--------------------------------------------------
Protected Routes
--------------------------------------------------
*/

// Get current logged-in user
router.get("/me", protect, getMe);


/*
--------------------------------------------------
Role-based Example Routes
--------------------------------------------------
*/

// Only admin can access
router.get(
  "/admin-test",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Admin route accessed successfully",
      user: req.user
    });
  }
);

// Admin and Manager allowed
router.get(
  "/manager-test",
  protect,
  authorizeRoles("admin", "manager"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Manager/Admin route accessed successfully",
      user: req.user
    });
  }
);

export default router;
