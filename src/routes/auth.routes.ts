import { Router } from "express";

import AuthController from "@/controllers/auth.controller";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { authRateLimiter } from "@/middlewares/rate-limiter.middleware";

const router: Router = Router();

// Traditional email/password authentication
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

// Password reset
router.post("/forgot-password", authRateLimiter, AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);

// Email verification
router.post("/request-verification", authRateLimiter, AuthController.requestVerification);
router.get("/verify-email/:token", AuthController.verifyEmail);

// Google OAuth authentication
router.get("/google", AuthController.googleAuth);
router.get("/google/callback", AuthController.googleCallback);
router.get("/failure", AuthController.authFailure);

// Me
router.get("/me", authMiddleware, AuthController.getCurrentUser);

export default router;
