import { Router } from "express";

import {
  authFailure,
  forgotPassword,
  getCurrentUser,
  googleAuth,
  googleCallback,
  login,
  register,
  requestVerification,
  resetPassword,
  verifyEmail,
} from "@/controllers/auth.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { authRateLimiter } from "@/middlewares/rate-limiter.middleware";

const router: Router = Router();

router.use("/auth");

// Traditional email/password authentication
router.post("/register", register);
router.post("/login", login);

// Password reset
router.post("/forgot-password", authRateLimiter, forgotPassword);
router.post("/reset-password", resetPassword);

// Email verification
router.post("/request-verification", authRateLimiter, requestVerification);
router.get("/verify-email/:token", verifyEmail);

// Google OAuth authentication
router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);
router.get("/failure", authFailure);

// Me
router.get("/me", authMiddleware, getCurrentUser);

export { router as authRoutes };
