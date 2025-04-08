import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import logger from "../utils/logger";
import { ApiResponse } from "../types/response";

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 记录错误
  logger.error(`${err.message}`);
  logger.debug(err.stack || "无堆栈信息");

  // 获取错误信息
  const isDev = process.env.NODE_ENV !== "production";

  // 设置默认值
  let statusCode = 500;
  let errorCode = 1;
  let errorMessage = "服务器内部错误";

  // 处理自定义错误类型
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    errorCode = err.code;
    errorMessage = err.message;
  } else if (err.name === "SyntaxError") {
    statusCode = 400;
    errorMessage = "请求格式错误";
  }

  const response: ApiResponse<null> = {
    data: null,
    msg: errorMessage,
    code: errorCode,
  };

  // 在开发环境下添加额外的错误信息
  if (isDev) {
    (response as any).stack = err.stack;
    (response as any).detail = err.toString();
  }

  res.status(statusCode).json(response);
};
