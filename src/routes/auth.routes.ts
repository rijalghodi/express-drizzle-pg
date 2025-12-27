import { Router } from "express";

import AuthController from "../controllers/auth.controller";

const router: Router = Router();

// Traditional email/password authentication
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
// TODO: forgot password
// TODO: reset password
// TODO: request verification
// TODO: verify email

// Google OAuth authentication
router.get("/google", AuthController.googleAuth);
router.get("/google/callback", AuthController.googleCallback);
router.get("/failure", AuthController.authFailure);

export default router;
