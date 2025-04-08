import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();
// host: "localhost" - 本地数据库。
// user: "root" - MySQL 用户名。
// password: "12345678" - MySQL 密码。
// database: "task_manager" - 目标数据库。
// connectionLimit: 限制最大连接数为 10。
// waitForConnections 和 queueLimit：确保连接池在高负载时正常工作。
// 使用环境变量进行配置
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "task_manager",
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
  queueLimit: 0,
});

export default pool;
