import { Router } from "express";
import {
  getTasks,
  addTask,
  getTask,
  updateTaskById,
  deleteTaskById,
} from "../controllers/taskController";

const router = Router();

// 获取所有任务
router.get("/tasks", getTasks);

// 创建新任务
router.post("/tasks", addTask);

// 获取单个任务
router.get("/tasks/:id", getTask);

// 更新任务
router.put("/tasks/:id", updateTaskById);

// 删除任务
router.delete("/tasks/:id", deleteTaskById);

export default router;
