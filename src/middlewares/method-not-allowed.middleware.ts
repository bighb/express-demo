import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import { ApiResponse } from "../types/response";

export const methodNotAllowedMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // OPTIONS请求通常用于CORS预检，应该被正常处理
  if (req.method === "OPTIONS") {
    return next();
  }

  // 记录方法不匹配的详细信息
  logger.warn(`HTTP方法不匹配: ${req.method} ${req.originalUrl}`);
  logger.debug(`客户端信息: IP=${req.ip}, User-Agent=${req.get("user-agent")}`);

  // 返回标准格式的错误响应
  const response: ApiResponse<null> = {
    data: null,
    msg: `不支持的HTTP方法: ${req.method}，该接口仅支持 ${getSupportedMethods(
      req
    )}`,
    code: 1,
  };

  res.status(405).set("Allow", getSupportedMethods(req)).json(response);
};

// 辅助函数：获取路由支持的HTTP方法
function getSupportedMethods(req: Request): string {
  const app = req.app;
  const route = app._router?.stack
    .filter((layer: any) => layer.route && layer.route.path === req.path)
    .map((layer: any) =>
      Object.keys(layer.route.methods)
        .map((m) => m.toUpperCase())
        .join(", ")
    );

  return route && route.length > 0 ? route[0] : "GET";
}
