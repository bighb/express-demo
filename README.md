# Express 中间件详解与大型项目架构

## Express 中间件深入理解

### 1. 中间件本质

中间件本质上是一个函数，接收 `request`、`response` 对象和 [next](vscode-file://vscode-app/Applications/Visual Studio Code.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) 函数。Express 应用就是一系列中间件函数的调用栈。

### 2. 中间件类型

- **应用级中间件**: [app.use()](vscode-file://vscode-app/Applications/Visual Studio Code.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html), [app.METHOD()](vscode-file://vscode-app/Applications/Visual Studio Code.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html)
- **路由级中间件**: `router.use()`, `router.METHOD()`
- **错误处理中间件**: `(err, req, res, next) => {}`
- **内置中间件**: [express.json()](vscode-file://vscode-app/Applications/Visual Studio Code.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html), [express.static()](vscode-file://vscode-app/Applications/Visual Studio Code.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html)
- **第三方中间件**: `morgan`, `cors`, `helmet`

### 3. 中间件工作流程

```
请求 → 中间件1 → 中间件2 → ... → 路由处理 → ... → 中间件n → 响应
```

### 4. 中间件注意事项

- 顺序至关重要
- 必须调用 [next()](vscode-file://vscode-app/Applications/Visual Studio Code.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) 或结束响应
- 可以修改 [req/res](vscode-file://vscode-app/Applications/Visual Studio Code.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html) 对象
- 可以提前终止请求-响应周期

## 大型Web项目的模块化与结构划分

### 1. 常见项目结构

```
project/
├── src/
│   ├── config/            # 配置文件
│   ├── controllers/       # 控制器
│   ├── middlewares/       # 自定义中间件
│   ├── models/            # 数据模型
│   ├── routes/            # 路由定义
│   ├── services/          # 业务逻辑
│   ├── utils/             # 工具函数
│   ├── validators/        # 数据验证
│   └── index.ts           # 主入口
├── tests/                 # 测试文件
├── .env                   # 环境变量
└── package.json
```

### 2. 架构模式

#### MVC模式

- **模型(Model)**: 数据和业务逻辑
- **视图(View)**: 表现层(API响应)
- **控制器(Controller)**: 处理请求和响应

#### 分层架构

路由层 → 控制器层 → 服务层 → 数据访问层

### 3. 模块化策略

#### 按功能划分

每个功能模块包含自身的路由、控制器、服务等：

```
modules/
├── auth/
│   ├── auth.controller.ts
│   ├── auth.routes.ts
│   ├── auth.service.ts
│   └── auth.model.ts
├── users/
│   ├── ...
└── products/
    └── ...
```

#### 按技术关注点划分

```
src/
├── routes/
│   ├── auth.routes.ts
│   ├── user.routes.ts
│   └── ...
├── controllers/
│   ├── auth.controller.ts
│   ├── user.controller.ts
│   └── ...
```

### 4. 大型项目最佳实践

- **依赖注入**: 使用 `inversify`, `typedi` 等
- **API文档**: 使用 Swagger/OpenAPI
- **微服务**: 将大型应用拆分为小型、独立部署的服务
- **中间件组合**: 创建特定路由组的中间件链
- **错误处理集中化**: 全局错误处理中间件
- **配置管理**: 不同环境的配置分离
- **日志系统**: 分级日志、请求追踪
- **监控与性能**: 性能监控中间件

### 5. 扩展性考虑

- **插件系统**: 允许功能模块化添加
- **钩子系统**: 在关键点提供扩展点
- **事件系统**: 通过事件总线解耦组件

