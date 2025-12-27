import dotenv from "dotenv";
import express from "express";
import { Express } from "express";
import { Request } from "express";
import morgan from "morgan";
import passport from "passport";

import { configureGoogleOAuth } from "./config/google-oauth.config";
import authRoutes from "./routes/auth.routes";
import todoRoutes from "./routes/todo.routes";

dotenv.config();

// Configure Google OAuth Strategy
// configureGoogleOAuth();

const app: Express = express();

app.use(express.json());

// Initialize Passport (without sessions, using JWT)
app.use(passport.initialize());

// Request Body Content Logging Token
morgan.token("body", (req: Request) => {
  return JSON.stringify(req.body);
});

// Request Params Content Logging Token
morgan.token("params", (req: Request) => {
  return JSON.stringify(req.params) || "-";
});

// Log HTTP requests
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms | body: :body | params: :params"
  )
);

app.use("/auth", authRoutes);
app.use("/todos", todoRoutes);

const PORT = process.env.EXPRESS_PORT || 8000;

// Store the server instance so we can close it later
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export the app for testing
export { app, server };
