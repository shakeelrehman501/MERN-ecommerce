import express from "express";
import {
  loggedIn,
  loggedOut,
  register,
  reVerify,
  forgotPassword,
  verify,
  verifyOTP,
  changePassword,
  refreshToken,
  resetPassword,
} from "../controllers/authController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { validate } from "../middleware/validate.js";
import { changePasswordSchema, forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema, reVerifySchema, verifyOtpSchema, verifySchema } from "../validations/auth.validation.js";

const router = express.Router();

// Authentication
router.post("/register", validate(registerSchema), register);
router.post("/verify", validate(verifySchema), verify);
router.post("/reverify", validate(reVerifySchema), reVerify);
router.post("/login", validate(loginSchema), loggedIn);
router.post("/logout", isAuthenticated, loggedOut);
router.post("/refresh-token", refreshToken);

// Forgot Password
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/verify-otp", validate(verifyOtpSchema), verifyOTP);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.patch("/change-password", isAuthenticated, validate(changePasswordSchema), changePassword);


export default router;
