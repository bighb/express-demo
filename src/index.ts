import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import cors from "cors";
import { errorHandler } from "./middlewares/error.middleware";
import { requestLogger } from "./middlewares/logger.middleware";
import taskRoutes from "./routes/taskRoutes";
dotenv.config();
const app = express();
const PORT = 3000;
// 应用级中间件：记录请求日志
app.use(requestLogger);
// 解析JSON
app.use(express.json());
// 解析urlencoded
app.use(express.urlencoded({ extended: true }));
// 使用cors
app.use(cors());

//挂载路由
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", taskRoutes);
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Express with TypeScript!");
});

// 404处理 - 移到最后面，在所有正常路由之后
app.use((req, res) => {
  res.status(404).send("Not Found");
});
// 错误处理中间件（必须放在最后）
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Swagger UI at http://localhost:${PORT}/api-docs`);
});
