import mysql from "mysql2/promise";
import dotenv from "dotenv";
import logger from "../utils/logger";
import { DatabaseError } from "../utils/errors";

dotenv.config();

// 创建连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "task_manager",
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
  queueLimit: 0,
});

// 测试连接
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    logger.info("数据库连接成功");
    connection.release();
    return true;
  } catch (error) {
    logger.error(
      `数据库连接失败: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    logger.debug(error instanceof Error ? error.stack : "");
    return false;
  }
};

// 包装查询方法以添加错误处理
export const executeQuery = async (sql: string, params?: any[]) => {
  try {
    return await pool.query(sql, params);
  } catch (error) {
    logger.error(`SQL查询失败: ${sql}`);
    logger.error(`参数: ${params ? JSON.stringify(params) : "none"}`);
    logger.error(
      error instanceof Error ? error.stack || error.message : String(error)
    );
    throw new DatabaseError("查询执行失败", error);
  }
};

// 初始化时立即测试连接
testConnection();

export default pool;
