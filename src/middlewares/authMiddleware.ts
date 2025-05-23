// 导入必要的库和类型
import { Request, Response, NextFunction } from "express"; // 从express导入请求、响应和下一步函数类型
import jwt from "jsonwebtoken"; // 导入JWT库用于令牌验证
import { JwtPayload } from "../types/jwt"; // 导入 JwtPayload

/**
 * 认证中间件 - 验证用户JWT令牌
 *
 * 该中间件从请求头中提取Bearer令牌，验证其有效性，
 * 并将解码后的用户信息附加到请求对象上，以便后续处理使用
 */
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 从Authorization头中提取Bearer令牌
  const token = req.headers["authorization"]?.split(" ")[1]; // 提取 Bearer 后的 token

  // 检查令牌是否存在
  if (!token) {
    res.status(401).json({ message: "未提供 Token" });
    return;
  }

  try {
    // 验证令牌并解码其内容
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    // 将解码后的用户信息附加到请求对象
    req.user = decoded; // 将解码后的用户信息附加到 req

    // 继续处理下一个中间件或路由处理函数
    next();
  } catch (error) {
    // 令牌无效或已过期时返回403错误
    res.status(403).json({ message: "Token 无效" });
  }
};
