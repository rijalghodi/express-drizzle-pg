import { Router } from "express";

import { authController } from "@/controllers/auth.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { authRateLimiter } from "@/middlewares/rate-limiter.middleware";

const router: Router = Router();

router.use("/auth");

// Traditional email/password authentication
router.post("/register", authController.register);
router.post("/login", authController.login);

// Password reset
router.post("/forgot-password", authRateLimiter, authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

// Email verification
router.post("/request-verification", authRateLimiter, authController.requestVerification);
router.get("/verify-email/:token", authController.verifyEmail);

// Google OAuth authentication
router.get("/google", authController.googleAuth);
router.get("/google/callback", authController.googleCallback);
router.get("/failure", authController.authFailure);

// Me
router.get("/me", authMiddleware, authController.getCurrentUser);

export { router as authRoutes };
