import "express";

import { PaginationResponseArgs } from "@/middlewares/response.middleware";

import { JwtPayload } from "./auth.interface";

declare global {
  //in the global score
  namespace Express {
    // in the express namespace
    interface Request {
      // extending the Request Interface
      authUser?: JwtPayload; //adding optional authUser property for storing JwtPayload data during middleware operations
    }
    interface Response {
      success<T>(data?: T, statusCode?: number, message?: string): void;
      error(message: string, statusCode?: number, details?: unknown): void;
      paginated<T>(items: T[], pagination: PaginationResponseArgs): void;
    }
  }
}
