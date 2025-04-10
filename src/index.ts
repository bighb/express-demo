import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import cors from "cors";
import { errorHandler } from "./middlewares/error.middleware";
import { requestLogger } from "./middlewares/logger.middleware";
import { methodNotAllowedMiddleware } from "./middlewares/method-not-allowed.middleware";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";
import healthRoutes from "./routes/healthRoutes";
import logger from "./utils/logger";
import { testConnection } from "./config/db";

dotenv.config();
const app = express();
const PORT = 3000;

// 初始化并测试数据库连接
(async () => {
  const isConnected = await testConnection();
  if (!isConnected) {
    logger.warn("应用启动时数据库连接失败，API可能无法正常工作");
  }
})();
// 应用级中间件：记录请求日志
app.use(requestLogger);
// 解析JSON
// 配置 express.json() 来捕获原始请求体
app.use(express.json());
// 解析urlencoded
app.use(express.urlencoded({ extended: true }));
// 使用cors
app.use(cors());

//挂载路由
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/auth", authRoutes);
app.use("/api", taskRoutes);
// 健康检查路由
app.use("/", healthRoutes);

// 主页路由
app.get("/", (req, res) => {
  res.send("任务管理API服务运行中");
});
// 方法不匹配中间件 (应放在所有路由之后)
app.use(methodNotAllowedMiddleware);
// 404处理 - 移到最后面，在所有正常路由之后
app.use((req, res) => {
  res.status(404).json({
    data: null,
    msg: "请求的路径不存在",
    code: 404,
  });
});

// 错误处理中间件（必须放在最后）
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Swagger UI at http://localhost:${PORT}/api-docs`);
});

// 处理未捕获的异常
process.on("uncaughtException", (error) => {
  logger.error("未捕获的异常:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error("未处理的Promise拒绝:", reason);
});
