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

router.get("/", authenticateToken, getTasks);
router.post("/", authenticateToken, addTask);
router.get("/:id", authenticateToken, getTask);
router.put("/:id", authenticateToken, updateTaskById);
router.delete("/:id", authenticateToken, deleteTaskById);
// 新增路由 - 获取指定用户的任务(管理员功能)
router.get("/users/:userId/tasks", authenticateToken, getUserTasks);
export default router;
