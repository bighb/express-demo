FROM node:18-alpine

WORKDIR /app

# 安装pnpm
RUN npm install -g pnpm

# 复制package.json和pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 使用pnpm安装依赖
RUN pnpm install

# 文件复制到 /app
COPY . .

# 编译TypeScript
RUN pnpm build

# 移除开发依赖减小镜像体积
RUN pnpm prune --prod
# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", "dist/index.js"]