import { Router } from "express";
import {
  getTasks,
  addTask,
  getTask,
  updateTaskById,
  deleteTaskById,
} from "../controllers/taskController";

const router = Router();

router.get("/tasks", getTasks);
router.post("/tasks", addTask);
router.get("/tasks/:id", getTask);
router.put("/tasks/:id", updateTaskById);
router.delete("/tasks/:id", deleteTaskById);

export default router;
