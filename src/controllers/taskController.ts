import { RequestHandler } from "express";
import {
  getAllTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
} from "../models/taskModel";
import { Task } from "../types/task";
// getTasks：获取所有任务并返回。
// addTask：验证标题后创建任务，返回新任务详情。
// 使用 try-catch 处理错误，返回合适的 HTTP 状态码。
export const getTasks: RequestHandler = async (req, res) => {
  try {
    const tasks = await getAllTasks();
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching tasks");
  }
};

export const addTask: RequestHandler = async (req, res) => {
  const { title, description, status } = req.body as Task;
  if (!title) {
    res.status(400).send("Title is required");
    return;
  }

  // 验证和转换 status
  const validStatuses = ["pending", "in_progress", "completed"] as const;
  let taskStatus: Task["status"] = "pending"; // 默认值
  if (status !== undefined) {
    if (typeof status === "number") {
      // 将数字映射到 ENUM 值
      const statusMap: Record<number, Task["status"]> = {
        1: "pending",
        2: "in_progress",
        3: "completed",
      };
      taskStatus = statusMap[status] || "pending"; // 无效数字默认 pending
    } else if (validStatuses.includes(status as any)) {
      taskStatus = status as Task["status"];
    } else {
      res.status(400).send("Invalid status value");
      return;
    }
  }

  const task: Task = { title, description, status };
  try {
    const taskId = await createTask(task);
    res.status(201).json({ id: taskId, ...task });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating task");
  }
};

export const getTask: RequestHandler = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).send("Invalid task ID");
    // RequestHandler 类型期望函数返回 void 或 Promise<void>，而不是返回 Response 对象。
    // 当你使用 return res.status() 时，函数会返回 Response 对象，这与类型定义不符。
    return;
  }

  try {
    const task = await getTaskById(id);
    if (!task) {
      res.status(404).send("Task not found");
      return;
    }
    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching task");
  }
};

export const updateTaskById: RequestHandler = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).send("Invalid task ID");
    return;
  }

  const updates = req.body as Partial<Task>;
  if (Object.keys(updates).length === 0) {
    res.status(400).send("No update data provided");
    return;
  }

  try {
    const taskExists = await getTaskById(id);
    if (!taskExists) {
      res.status(404).send("Task not found");
      return;
    }

    const result = await updateTask(id, updates);
    if (!result) {
      res.status(400).send("Update failed");
      return;
    }

    const updatedTask = await getTaskById(id);
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating task");
  }
};

export const deleteTaskById: RequestHandler = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).send("Invalid task ID");
    return;
  }

  try {
    const taskExists = await getTaskById(id);
    if (!taskExists) {
      res.status(404).send("Task not found");
      return;
    }

    const result = await deleteTask(id);
    if (!result) {
      res.status(400).send("Delete failed");
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting task");
  }
};
