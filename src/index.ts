import express, { Request, Response } from "express";
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
// 3. 挂载路由
app.use("/api", taskRoutes);
// 4. 定义根路由
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Express with TypeScript!");
});
// 404处理
app.use((req, res) => {
  res.status(404).send("Not Found");
});

// 错误处理
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
  }
);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
