import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack); // 记录错误堆栈，便于调试
  // 如果响应状态码错误码已被设为非200值（可能在前面的中间件中已设置），则保留该状态码
  // 如果状态码仍为默认的200，因为是错误捕捉，所以应该不属于 200 状态，则将其设为500（服务器内部错误）
  // 这样设计可以保留前面中间件可能已经设置的更具体的错误状态码
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500; // 默认状态码为 500
  res.status(statusCode).json({
    message: err.message, // 错误信息
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack, // 生产环境隐藏堆栈
  });
};
