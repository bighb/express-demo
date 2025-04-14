/**
 * 认证控制器
 * 负责处理用户注册和登录的业务逻辑
 */
import { Request, Response, RequestHandler } from "express"; // 导入Express相关类型
import jwt from "jsonwebtoken"; // 导入JWT库用于生成认证令牌
import {
  findUserByUsername, // 根据用户名查找用户
  createUser, // 创建新用户
  validatePassword, // 验证密码
  isUsernameExists, // 添加新方法的导入
} from "../models/userModel";
import { ApiResponse } from "../types/response"; // 导入统一响应格式
import logger from "../utils/logger"; // 导入日志工具

/**
 * 用户注册处理
 * @param req 请求对象，包含用户名、密码和角色信息
 * @param res 响应对象，用于返回注册结果
 */
export const register: RequestHandler = async (req: Request, res: Response) => {
  // 从请求体中解构用户信息
  const { username, password, role } = req.body;

  // 验证必填字段
  if (!username || !password) {
    const response: ApiResponse<null> = {
      data: null,
      msg: "用户名和密码必填",
      code: 1,
    };
    res.status(400).json(response);
    return;
  }

  try {
    // 检查用户名是否已存在
    const exists = await isUsernameExists(username);
    if (exists) {
      const response: ApiResponse<null> = {
        data: null,
        msg: "用户名已存在",
        code: 1,
      };
      res.status(409).json(response);
      return;
    }

    // 用户名不存在，创建新用户
    const userId = await createUser(username, password, role);
    logger.info(`用户创建成功: ID=${userId}, 用户名="${username}"`);

    const response: ApiResponse<{ userId: number }> = {
      data: { userId },
      msg: "用户创建成功",
      code: 0,
    };
    res.status(201).json(response);
  } catch (error) {
    // 处理创建用户过程中可能发生的错误
    logger.error(
      `创建用户失败: ${error instanceof Error ? error.message : String(error)}`
    );

    const response: ApiResponse<null> = {
      data: null,
      msg: "创建用户失败",
      code: 1,
    };
    res.status(500).json(response);
  }
};

/**
 * 用户登录处理
 * @param req 请求对象，包含用户名和密码
 * @param res 响应对象，用于返回登录结果和JWT令牌
 */
export const login: RequestHandler = async (req: Request, res: Response) => {
  // 从请求体中解构登录信息
  const { username, password } = req.body;

  // 验证必填字段
  if (!username || !password) {
    const response: ApiResponse<null> = {
      data: null,
      msg: "用户名和密码必填",
      code: 1,
    };
    res.status(400).json(response);
    return;
  }

  try {
    // 根据用户名查找用户
    const user = await findUserByUsername(username);

    // 验证用户存在且密码正确
    if (!user || !(await validatePassword(password, user.password))) {
      const response: ApiResponse<null> = {
        data: null,
        msg: "用户名或密码错误",
        code: 1,
      };
      res.status(401).json(response);
      return;
    }

    // 生成JWT令牌，包含用户ID和角色信息
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "30d" } // 令牌有效期为1个月
    );

    logger.info(`用户 "${username}" 登录成功`);

    // 返回登录成功信息和JWT令牌
    const response: ApiResponse<{ token: string }> = {
      data: { token },
      msg: "登录成功",
      code: 0,
    };
    res.status(200).json(response);
  } catch (error) {
    // 处理登录过程中可能发生的错误
    logger.error(
      `登录失败: ${error instanceof Error ? error.message : String(error)}`
    );

    const response: ApiResponse<null> = {
      data: null,
      msg: "登录失败",
      code: 1,
    };
    res.status(500).json(response);
  }
};
