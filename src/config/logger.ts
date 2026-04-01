/**
 * Google Cloud Run compatible logger.
 * In production, it outputs structured JSON with expected `severity` fields.
 * In development, it falls back to readable console output.
 */

const isProduction = process.env.NODE_ENV === "production";

export const logger = {
  info: (message: string, meta?: any) => {
    if (isProduction) {
      console.log(JSON.stringify({ severity: "INFO", message, ...meta }));
    } else {
      if (meta) {
        console.log(`[INFO] ${message}`, meta);
      } else {
        console.log(`[INFO] ${message}`);
      }
    }
  },

  error: (message: string, error?: any, meta?: any) => {
    let errorStack = "";
    let errorMessage = "";

    if (error instanceof Error) {
      errorMessage = error.message;
      errorStack = error.stack || "";
    } else if (typeof error === "string") {
      errorMessage = error;
    } else if (error) {
      try {
        errorMessage = JSON.stringify(error);
      } catch (_e) {
        errorMessage = String(error);
      }
    }

    if (isProduction) {
      console.error(
        JSON.stringify({
          severity: "ERROR",
          message: message + (errorMessage ? ` - ${errorMessage}` : ""),
          errorStack,
          ...meta,
        })
      );
    } else {
      if (error && meta) {
        console.error(`[ERROR] ${message}`, error, meta);
      } else if (error) {
        console.error(`[ERROR] ${message}`, error);
      } else {
        console.error(`[ERROR] ${message}`);
      }
    }
  },

  warn: (message: string, meta?: any) => {
    if (isProduction) {
      console.warn(JSON.stringify({ severity: "WARNING", message, ...meta }));
    } else {
      if (meta) {
        console.warn(`[WARN] ${message}`, meta);
      } else {
        console.warn(`[WARN] ${message}`);
      }
    }
  },

  debug: (message: string, meta?: any) => {
    if (isProduction) {
      console.log(JSON.stringify({ severity: "DEBUG", message, ...meta }));
    } else {
      if (meta) {
        console.debug(`[DEBUG] ${message}`, meta);
      } else {
        console.debug(`[DEBUG] ${message}`);
      }
    }
  },
};
