# 任务管理API

一个基于Express和TypeScript构建的RESTful API项目，提供任务(Task)管理功能，包括任务的创建、查询、更新和删除。本项目主要用于学习Express框架和TypeScript在后端开发中的应用。

<div align="center">
  <a href="./README_DEMO.md">详细 Express 技术架构说明文档</a>
</div>
## 特性

- RESTful API设计
- 分层架构（路由、控制器、模型）
- Swagger API文档自动生成
- 错误处理中间件
- 日志系统（分级日志、文件日志）
- 健康检查端点
- MySQL数据库连接池
- TypeScript类型保障
- 环境变量配置

## 技术栈

- **语言**: TypeScript

- **运行时**: Node.js

- **框架**: Express
- **包管理**: pnpm

- **数据库**: MySQL

- **API文档**: Swagger/OpenAPI
- **日志**: Winston

- 其他工具：
  - dotenv: 环境变量管理
  - `mysql2`: 高性能MySQL客户端
  - cors: 跨域资源共享
  - `nodemon`: 开发环境热重载

## 先决条件

- Node.js (推荐 v18+)
- pnpm (推荐最新版)
- MySQL 数据库

## 安装步骤

### 1. 克隆仓库

```bash
git clone https://github.com/bighb/express-demo.git

cd my-blog-api
```

### 2. 安装依赖

```bash
pnpm install
```



### 3. 配置数据库

运行`demo.sql`脚本创建数据库和表结构：

```bash
mysql -u root -p < demo.sql
```



### 4. 配置环境变量

复制`.env.example`文件并重命名为`.env`：

cp .env.example .env

根据你的数据库配置修改`.env`文件：

\# 数据库配置

```
DB_HOST=localhost

DB_USER=your_username

DB_PASSWORD=your_password

DB_NAME=task_manager

DB_CONNECTION_LIMIT=10
```



### 5. 构建项目

```bash
pnpm build
```

### 6. 启动服务

开发模式（热重载）：

pnpm dev

生产模式：

pnpm start

服务将在http://localhost:3000启动，你可以在浏览器访问http://localhost:3000/api-docs查看API文档。

## 项目结构

```
src/
├── config/            # 配置文件
│   ├── db.ts          # 数据库配置
│   └── swagger.ts     # Swagger配置
├── controllers/       # 控制器
│   └── taskController.ts
├── docs/              # API文档
│   └── task.docs.ts
├── middlewares/       # 中间件
│   ├── error.middleware.ts
│   └── logger.middleware.ts
├── models/            # 数据模型
│   └── taskModel.ts
├── routes/            # 路由定义
│   ├── healthRoutes.ts
│   └── taskRoutes.ts
├── types/             # 类型定义
│   ├── response.ts
│   └── task.ts
├── utils/             # 工具函数
│   ├── errors.ts
│   └── logger.ts
└── index.ts           # 应用入口
```

## 日志

日志文件存储在logs目录下：

- combined.log: 所有级别的日志
- error.log: 仅错误级别日志

## 贡献

欢迎提交Issue和Pull Request来完善本项目。

## License

本仓库遵循License 开源协议，该许可证本质上是 Apache 2.0，但有一些额外的限制。

