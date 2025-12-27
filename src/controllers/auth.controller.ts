import { NextFunction, Request, Response } from "express";
import passport from "passport";

import AuthService from "../services/auth.service";
import {
  LoginUserDTO,
  LoginUserResponseDTO,
  RegisterUserDTO,
  RegisterUserResponseDTO,
} from "../types/auth.types";
import { loginSchema, registerSchema } from "../validators/auth.schema";

const AuthController = {
  register: async (req: Request<object, object, RegisterUserDTO>, res: Response) => {
    try {
      //Validating Incoming Data using Zod Validator
      const { name, email, password } = registerSchema.parse(req.body);

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
      const { email, password } = loginSchema.parse(req.body);

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
          message: "Authentication successful",
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
};

export default AuthController;
