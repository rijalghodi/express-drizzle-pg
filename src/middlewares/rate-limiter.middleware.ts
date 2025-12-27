import rateLimit from "express-rate-limit";

/**
 * Global rate limiter for all endpoints
 * Limits: 100 requests per 15 minutes per IP address
 */
export const globalRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * Auth-specific rate limiter for sensitive operations
 * Limits: 1 request per 30 seconds per IP address
 * Use this for endpoints like forgot-password and request-verification
 */
export const authRateLimiter = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 1, // Limit each IP to 1 request per windowMs
  message: {
    success: false,
    message: "Too many requests. Please wait 30 seconds before trying again.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: false, // Count all requests, not just failed ones
});
