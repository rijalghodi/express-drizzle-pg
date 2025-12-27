import { Request, Response, NextFunction } from "express";

export const responseMiddleware = (_req: Request, res: Response, next: NextFunction) => {
  res.success = <T>(data: T) => {
    res.json({
      status: true,
      message: "success",
      data,
    });
  };

  res.error = (message, statusCode = 400, details = undefined) => {
    res.status(statusCode).json({
      status: false,
      message,
      details,
    });
  };

  res.paginated = <T>(items: T, page: number, pageSize: number, total: number) => {
    const totalPages = Math.ceil(total / pageSize);

    res.json({
      status: true,
      message: "success",
      data: {
        page,
        pageSize,
        total,
        totalPages,
        items,
      },
    });
  };

  next();
};
