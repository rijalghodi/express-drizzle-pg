import dotenv from "dotenv";
dotenv.config();

const ENV = {
  // APP
  JWT_SECRET: process.env.JWT_SECRET || "secret",
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || "1h",
  EXPRESS_PORT: process.env.EXPRESS_PORT || 8000,

  // GOOGLE OAUTH
  GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID || "",
  GOOGLE_OAUTH_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET || "",
  GOOGLE_OAUTH_CLIENT_CALLBACK_URI:
    process.env.GOOGLE_OAUTH_CLIENT_CALLBACK_URI || "http://localhost:8000/auth/google/callback",

  // EMAIL
  EMAIL_HOST: process.env.EMAIL_HOST || "smtp.gmail.com",
  EMAIL_PORT: parseInt(process.env.EMAIL_PORT || "587"),
  EMAIL_USER: process.env.EMAIL_USER || "",
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || "",
  EMAIL_FROM: process.env.EMAIL_FROM || "noreply@yourapp.com",
  APP_URL: process.env.APP_URL || "http://localhost:8000",
};

export default ENV;
