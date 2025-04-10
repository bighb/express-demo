import { Router } from "express";
import {
  getTasks,
  addTask,
  getTask,
  updateTaskById,
  deleteTaskById,
  getUserTasks,
} from "../controllers/taskController";
import { authenticateToken } from "../middlewares/authMiddleware";
const router = Router();

router.get("/tasks", authenticateToken, getTasks);
router.post("/tasks", authenticateToken, addTask);
router.get("/tasks/:id", authenticateToken, getTask);
router.put("/tasks/:id", authenticateToken, updateTaskById);
router.delete("/tasks/:id", authenticateToken, deleteTaskById);
// 新增路由 - 获取指定用户的任务(管理员功能)
router.get("/users/:userId/tasks", authenticateToken, getUserTasks);
export default router;
