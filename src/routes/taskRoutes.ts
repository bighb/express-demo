import { Router } from "express";
import {
  getTasks,
  addTask,
  getTask,
  updateTaskById,
  deleteTaskById,
} from "../controllers/taskController";
import { authenticateToken } from "../middlewares/authMiddleware";
const router = Router();

router.get("/tasks", authenticateToken, getTasks);
router.post("/tasks", authenticateToken, addTask);
router.get("/tasks/:id", authenticateToken, getTask);
router.put("/tasks/:id", authenticateToken, updateTaskById);
router.delete("/tasks/:id", authenticateToken, deleteTaskById);

export default router;
