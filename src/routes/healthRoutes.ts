import { Router } from "express";
import { testConnection } from "../config/db";
import logger from "../utils/logger";

// 创建健康检查路由
// 该路由用于检查数据库连接状态
// 以及服务器的基本健康状况
// 例如：/health
// 该路由返回一个JSON对象，包含以下信息：
// - status: 服务器的健康状态（healthy/unhealthy）
// - timestamp: 当前时间戳
// - services: 包含各个服务的健康状态
//   - database: 数据库的健康状态（connected/disconnected）
// - 该路由使用GET方法
// - 该路由的路径为/health
// - 该路由的处理函数为一个异步函数
// - 该函数首先调用testConnection函数测试数据库连接
// - 如果连接成功，则返回200状态码和健康状态为healthy
// - 如果连接失败，则返回503状态码和健康状态为unhealthy
// - 该路由使用express.Router()创建
// - 该路由导出为默认模块
// - 该路由的路径为/health
// - 该路由的处理函数为一个异步函数
// - 该函数首先调用testConnection函数测试数据库连接
// - 如果连接成功，则返回200状态码和健康状态为healthy
// - 如果连接失败，则返回503状态码和健康状态为unhealthy
// - 该路由使用express.Router()创建
// - 该路由导出为默认模块
// - 该路由的路径为/health
// - 该路由的处理函数为一个异步函数
// - 该函数首先调用testConnection函数测试数据库连接
// - 如果连接成功，则返回200状态码和健康状态为healthy

const router = Router();

router.get("/health", async (req, res) => {
  const dbStatus = await testConnection();

  const health = {
    status: dbStatus ? "healthy" : "unhealthy",
    timestamp: new Date().toISOString(),
    services: {
      database: {
        status: dbStatus ? "connected" : "disconnected",
      },
    },
  };

  const statusCode = dbStatus ? 200 : 503;

  res.status(statusCode).json(health);
});

export default router;
