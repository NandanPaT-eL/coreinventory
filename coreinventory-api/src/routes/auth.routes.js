import { Router } from "express";
import {
  signUp,
  signIn,
  getMe,
  forgotPassword,
  resetPassword
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { validateZod } from "../middleware/validateZod.middleware.js";
import {
  signUpSchema,
  signInSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from "../validators/auth.validator.js";

const router = Router();

/*
--------------------------------------------------
Public Routes
--------------------------------------------------
*/

router.post("/signup", validateZod(signUpSchema), signUp);
router.post("/signin", validateZod(signInSchema), signIn);
router.post("/forgot-password", validateZod(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validateZod(resetPasswordSchema), resetPassword);

/*
--------------------------------------------------
Protected Routes
--------------------------------------------------
*/

router.get("/me", protect, getMe);

/*
--------------------------------------------------
Role-based Example Routes
--------------------------------------------------
*/

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
