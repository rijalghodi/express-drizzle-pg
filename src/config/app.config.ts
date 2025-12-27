export const JWT_SECRET = process.env.JWT_SECRET || "secret";
export const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1h";

// Google OAuth Configuration
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID || "";
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET || "";
export const GOOGLE_CALLBACK_URL =
  process.env.GOOGLE_OAUTH_CLIENT_CALLBACK_URI || "http://localhost:8000/auth/google/callback";
