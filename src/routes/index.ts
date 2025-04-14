import express from "express";
import authRoutes from "./authRoutes";
import taskRoutes from "./taskRoutes";
import healthRoutes from "./healthRoutes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../config/swagger";

const router = express.Router();

// 将所有路由整合到一起
router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
router.use("/auth", authRoutes);
router.use("/tasks", taskRoutes);
router.use("/health", healthRoutes);

export default router;
