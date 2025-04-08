import { Request, Response, NextFunction } from "express";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { method, url, ip } = req; // 提取请求方法、URL 和客户端 IP
  const timestamp = new Date().toISOString(); // 获取当前时间
  console.log(`[${timestamp}] ${method} ${url} from ${ip}`); // 打印日志
  next(); // 继续处理下一个中间件或路由
};
