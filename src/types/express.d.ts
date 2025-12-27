import { JwtPayload } from "./auth.interface";
import "express";

declare global {
  //in the global score
  namespace Express {
    // in the express namespace
    interface Request {
      // extending the Request Interface
      authUser?: JwtPayload; //adding optional authUser property for storing JwtPayload data during middleware operations
    }
    interface Response {
      success<T>(data: T): void;
      error(message: string, statusCode?: number, details?: unknown): void;
      paginated<T>(items: T, page: number, pageSize: number, total: number): void;
    }
  }
}
