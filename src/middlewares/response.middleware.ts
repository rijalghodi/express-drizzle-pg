import { NextFunction, Request, Response } from "express";

type PaginationResponseArgs = {
  page: number;
  pageSize: number;
  total: number;
};

export const responseMiddleware = (_req: Request, res: Response, next: NextFunction) => {
  res.success = <T>(data?: T, statusCode = 200, message = "success") => {
    res.status(statusCode).json({
      status: true,
      message,
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

  res.paginated = <T>(items: T[], pagination: PaginationResponseArgs) => {
    const totalPages = Math.ceil(pagination.total / pagination.pageSize);

    res.json({
      status: true,
      message: "success",
      data: {
        page: pagination.page,
        pageSize: pagination.pageSize,
        total: pagination.total,
        totalPages,
        items,
      },
    });
  };

  next();
};
