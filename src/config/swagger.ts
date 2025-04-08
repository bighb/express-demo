import swaggerJsdoc from "swagger-jsdoc";
// Swagger 配置
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "任务管理 API",
      version: "1.0.0",
      description: "API 文档描述",
    },
  },
  apis: ["./src/docs/*.docs.ts"], // 包含所有文档文件
};

export const swaggerSpec = swaggerJsdoc(options);
