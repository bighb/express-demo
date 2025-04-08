import express, { Request, Response, NextFunction } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes";
const app = express();
const PORT = 3000;
// 1. 先记录日志
app.use((req: Request, res: Response, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
// 2. 解析JSON
app.use(express.json());
// 2.1 解析urlencoded
app.use(express.urlencoded({ extended: true }));
// 2.2 使用cors
app.use(cors());

// Swagger 配置 - 移到这里，在API路由之前
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "任务管理 API",
      version: "1.0.0",
      description: "API 文档描述",
    },
  },
  apis: [__dirname + "/routes/*.ts"], // 使用绝对路径
};
const swaggerSpec = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 3. 挂载路由
app.use("/api", taskRoutes);
// 4. 定义根路由
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Express with TypeScript!");
});

// 404处理 - 移到最后面，在所有正常路由之后
app.use((req, res) => {
  res.status(404).send("Not Found");
});

// 全局错误处理中间件
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong", details: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Swagger UI at http://localhost:${PORT}/api-docs`);
});
