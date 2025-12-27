import { NextFunction, Request, Response } from "express";
import passport from "passport";

import AuthService from "../services/auth.service";
import {
  LoginUserDTO,
  LoginUserResponseDTO,
  RegisterUserDTO,
  RegisterUserResponseDTO,
} from "../types/auth.types";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  requestVerificationSchema,
  resetPasswordSchema,
} from "../validators/auth.schema";

const AuthController = {
  register: async (req: Request<object, object, RegisterUserDTO>, res: Response) => {
    try {
      //Validating Incoming Data using Zod Validator
      const { success, data, error } = registerSchema.safeParse(req.body);

      if (!success) {
        res.error("Invalid data", 400, error.issues);
        return;
      }

      const { name, email, password } = data;

      //Checking if user already exists, method written in auth.service
      const isExistingUser = await AuthService.findUserByEmail(email);
      if (isExistingUser) {
        res.error("User already exists", 400);
        return;
      }

      //Registering User using method written in auth.service
      const user = await AuthService.registerUser(name, email, password);

      // If user creation fails, handle the issue
      if (!user) {
        res.error("Error registering user", 500);
        return;
      }

      //Generating JWT Token
      const token = AuthService.generateToken(user.id, user.email);

      const response: RegisterUserResponseDTO = {
        token,
        id: user.id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
        image: user.image,
      };

      res.success(response);
    } catch (_error) {
      res.error("Error Registering User", 400);
    }
  },

  login: async (req: Request<object, object, LoginUserDTO>, res: Response) => {
    try {
      const { success, data, error } = loginSchema.safeParse(req.body);

      if (!success) {
        res.error("Invalid data", 400, error.issues);
        return;
      }

      const { email, password } = data;

      //Check if user exists
      const user = await AuthService.findUserByEmail(email);
      if (!user) {
        res.error("User does not exist", 400);
        return;
      }

      //Since the user exists, check if password is correct
      const isPasswordValid = await AuthService.comparePassword(password, user.password || "");
      if (!isPasswordValid) {
        res.error("Invalid Password", 400);
        return;
      }

      //Generate a JWT Token
      const token = AuthService.generateToken(user.id, user.email);

      const response: LoginUserResponseDTO = {
        token,
        id: user.id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
        image: user.image,
      };

      //Return token to user
      res.success(response);
    } catch (_error) {
      res.error("Error Logging In User", 500);
    }
  },

  // Google OAuth - Initiate authentication
  googleAuth: passport.authenticate("google", {
    scope: ["email", "profile"],
    session: false,
  }),

  // Google OAuth - Callback handler
  googleCallback: [
    passport.authenticate("google", { session: false, failureRedirect: "/auth/failure" }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        // Extract Google user data from passport
        const googleUser = req.user as {
          googleId: string;
          email: string;
          name: string;
          profilePicture: string;
        };

        // Create or update user in database
        const user = await AuthService.createOrUpdateGoogleUser(
          googleUser.googleId,
          googleUser.email,
          googleUser.name,
          googleUser.profilePicture
        );

        if (!user) {
          res.error("Error creating/updating user", 500);
          return;
        }

        // Generate JWT token
        const token = AuthService.generateToken(user.id, user.email);

        // Return token as JSON (for SPA/API clients)
        res.success({
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          },
        });
      } catch (error) {
        console.error("Google OAuth callback error:", error);
        res.error("Authentication failed", 500);
      }
    },
  ],

  // OAuth failure handler
  authFailure: (_req: Request, res: Response) => {
    res.error("Authentication failed", 401);
  },

  // Forgot password - Request password reset
  forgotPassword: async (req: Request, res: Response) => {
    try {
      const { success, data, error } = forgotPasswordSchema.safeParse(req.body);

      if (!success) {
        res.error("Invalid data", 400, error.issues);
        return;
      }

      const { email } = data;

      const sent = await AuthService.requestPasswordReset(email);

      if (!sent) {
        res.error("Failed to send password reset email", 500);
        return;
      }

      res.success("If your email is registered, you will receive a password reset link");
    } catch (error) {
      console.error("Forgot password error:", error);
      res.error("Failed to process password reset request", 500);
    }
  },

  // Reset password using token
  resetPassword: async (req: Request, res: Response) => {
    try {
      const { success, data, error } = resetPasswordSchema.safeParse(req.body);

      if (!success) {
        res.error("Invalid data", 400, error.issues);
        return;
      }

      const { token, password } = data;

      const resetted = await AuthService.resetPassword(token, password);

      if (!resetted) {
        res.error("Invalid or expired reset token", 400);
        return;
      }

      res.success("Password reset successfully");
    } catch (error) {
      console.error("Reset password error:", error);
      res.error("Failed to reset password", 500);
    }
  },

  // Request email verification
  requestVerification: async (req: Request, res: Response) => {
    try {
      const { success, data, error } = requestVerificationSchema.safeParse(req.body);

      if (!success) {
        res.error("Invalid data", 400, error.issues);
        return;
      }

      const { email } = data;

      // Find user by email
      const user = await AuthService.findUserByEmail(email);

      if (!user) {
        // Don't reveal if user exists (security best practice)
        res.success("If your email is registered, you will receive a verification email");
        return;
      }

      // Check if already verified
      if (user.isVerified) {
        res.error("Email is already verified", 400);
        return;
      }

      const sent = await AuthService.requestEmailVerification(user.id, email);

      if (!sent) {
        res.error("Failed to send verification email", 500);
        return;
      }

      res.success("Verification email sent successfully");
    } catch (error) {
      console.error("Request verification error:", error);
      res.error("Failed to send verification email", 500);
    }
  },

  // Verify email using token
  verifyEmail: async (req: Request, res: Response) => {
    try {
      const { token } = req.params;

      if (!token) {
        res.error("Verification token is required", 400);
        return;
      }

      const success = await AuthService.verifyEmail(token);

      if (!success) {
        res.error("Invalid or expired verification token", 400);
        return;
      }

      res.success("Email verified successfully");
    } catch (error) {
      console.error("Verify email error:", error);
      res.error("Failed to verify email", 500);
    }
  },
};

export default AuthController;
