import pool from "../config/db";
import bcrypt from "bcryptjs";
import { RowDataPacket } from "mysql2";
import logger from "../utils/logger";
import { DatabaseError, NotFoundError } from "../utils/errors";

// 定义用户数据的类型
// 这里使用了mysql2的RowDataPacket类型来定义用户数据
// 这样可以确保我们从数据库中获取的数据符合预期的结构
// 这也是一个很好的实践，因为它可以帮助我们避免一些潜在的错误
// 例如，如果我们在数据库中添加了一个新的字段，而没有在这里更新类型定义
// 那么在编译时就会报错，提示我们需要更新类型定义
// 这样可以帮助我们保持代码的一致性和可维护性
// 这里的User接口定义了用户数据的结构
interface User extends RowDataPacket {
  id: number;
  username: string;
  password: string;
  role: "user" | "admin";
}

// 通过用户名查找用户
export const findUserByUsername = async (
  username: string
): Promise<User | null> => {
  try {
    const [rows] = await pool.query<User[]>(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    logger.error(
      `查找用户 ${username} 失败: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    throw error instanceof DatabaseError
      ? error
      : new DatabaseError(`查找用户 ${username} 失败`, error);
  }
};

// 创建新用户
export const createUser = async (
  username: string,
  password: string,
  role: "user" | "admin" = "user"
): Promise<number> => {
  try {
    logger.info(`创建用户: ${username}, 角色: ${role}`);
    const hashedPassword = await bcrypt.hash(password, 10); // 加密密码
    const [result] = await pool.query(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, hashedPassword, role]
    );
    const insertId = (result as any).insertId;
    logger.info(`用户创建成功, ID: ${insertId}`);
    return insertId; // 返回新用户 ID
  } catch (error) {
    logger.error(
      `创建用户 ${username} 失败: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    throw error instanceof DatabaseError
      ? error
      : new DatabaseError(`创建用户 ${username} 失败`, error);
  }
};

// 验证密码
// 这里使用了bcryptjs库来验证密码
// bcrypt.compare方法会将输入的明文密码和数据库中存储的哈希密码进行比较
export const validatePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword); // 验证密码
  } catch (error) {
    logger.error(
      `密码验证失败: ${error instanceof Error ? error.message : String(error)}`
    );
    throw error instanceof DatabaseError
      ? error
      : new DatabaseError("密码验证失败", error);
  }
};

// 通过ID查找用户
export const findUserById = async (id: number): Promise<User | null> => {
  try {
    const [rows] = await pool.query<User[]>(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    logger.error(
      `查找用户ID ${id} 失败: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    throw error instanceof DatabaseError
      ? error
      : new DatabaseError(`查找用户ID ${id} 失败`, error);
  }
};

// 验证用户是否存在
// 这里使用了findUserByUsername方法来检查用户是否存在
export const isUsernameExists = async (username: string): Promise<boolean> => {
  try {
    const user = await findUserByUsername(username);
    return !!user; // 如果用户存在返回true，否则返回false
  } catch (error) {
    logger.error(
      `检查用户名 ${username} 是否存在失败: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    throw error instanceof DatabaseError
      ? error
      : new DatabaseError(`检查用户名是否存在失败`, error);
  }
};
