import mysql from "mysql2/promise";
// host: "localhost" - 本地数据库。
// user: "root" - MySQL 用户名。
// password: "12345678" - MySQL 密码。
// database: "task_manager" - 目标数据库。
// connectionLimit: 限制最大连接数为 10。
// waitForConnections 和 queueLimit：确保连接池在高负载时正常工作。
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "task_manager",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
