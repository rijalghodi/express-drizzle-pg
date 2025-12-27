import dotenv from "dotenv";
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || "secret";
export const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1h";
export const EXPRESS_PORT = process.env.EXPRESS_PORT || 8000;

// Google OAuth Configuration
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID || "";
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET || "";
export const GOOGLE_CALLBACK_URL =
  process.env.GOOGLE_OAUTH_CLIENT_CALLBACK_URI || "http://localhost:8000/auth/google/callback";
