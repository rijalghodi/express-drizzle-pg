import express from "express";
import { Express } from "express";
import { Request } from "express";
import morgan from "morgan";
import passport from "passport";

import { configureGoogleOAuth } from "./config/google-oauth.config";
import authRoutes from "./routes/auth.routes";
import todoRoutes from "./routes/todo.routes";
import ENV from "./config/env";
import { responseMiddleware } from "./middlewares/response.middleware";
import { globalRateLimiter } from "./middlewares/rate-limiter.middleware";

// Configure Google OAuth Strategy
configureGoogleOAuth();

const app: Express = express();

app.use(express.json());

// Initialize Passport (without sessions, using JWT)
app.use(passport.initialize());
app.use(responseMiddleware);

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

// Apply global rate limiter
app.use(globalRateLimiter);

app.use("/auth", authRoutes);
app.use("/todos", todoRoutes);

// Store the server instance so we can close it later
const server = app.listen(ENV.EXPRESS_PORT, () => {
  console.log(`Server running on port ${ENV.EXPRESS_PORT}`);
});

// Export the app for testing
export { app, server };
