import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export const rawBodyMiddleware = (
  req: Request & { rawBody?: string },
  res: Response,
  next: NextFunction
) => {
  let data = "";

  // 只处理POST/PUT/PATCH请求
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    req.on("data", (chunk) => {
      data += chunk;
    });

    req.on("end", () => {
      req.rawBody = data;

      // 尝试解析JSON以便提前捕获解析错误
      if (req.headers["content-type"]?.includes("application/json")) {
        try {
          JSON.parse(data);
        } catch (error: any) {
          logger.error(`JSON解析错误: ${error.message}`);
          logger.error(`原始请求数据: ${data}`);

          return res.status(400).json({
            data: null,
            msg: `无效的JSON格式: ${error.message}`,
            code: 1,
            rawData: data,
          });
        }
      }
      next();
    });
  } else {
    next();
  }
};
