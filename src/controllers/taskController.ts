import { RequestHandler } from "express";
import {
  getAllTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
} from "../models/taskModel";
import { Task } from "../types/task";
import { ApiResponse } from "../types/response";
// getTasks：获取所有任务并返回。
// addTask：验证标题后创建任务，返回新任务详情。
// 使用 try-catch 处理错误，返回合适的 HTTP 状态码。
export const getTasks: RequestHandler = async (req, res) => {
  try {
    const tasks = await getAllTasks();
    const response: ApiResponse<Task[]> = {
      data: tasks,
      msg: "Success",
      code: 0,
    };
    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      data: null,
      msg: "Error fetching tasks",
      code: 1,
    };
    res.status(500).json(response);
  }
};

export const addTask: RequestHandler = async (req, res) => {
  const { title, description, status } = req.body as Task;
  if (!title) {
    const response: ApiResponse<null> = {
      data: null,
      msg: "Title is required",
      code: 1,
    };
    res.status(400).json(response);
    return;
  }

  // 验证和转换 status
  const validStatuses = ["pending", "in_progress", "completed"];
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
      const response: ApiResponse<null> = {
        data: null,
        msg: "Invalid status value",
        code: 1,
      };
      res.status(400).json(response);
      return;
    }
  }

  const task: Task = { title, description, status: taskStatus };
  try {
    console.log("task: ", task);
    const taskId = await createTask(task);
    const response: ApiResponse<{ id: number } & Task> = {
      data: { id: taskId, ...task },
      msg: "Success",
      code: 0,
    };
    res.status(201).json(response);
  } catch (error) {
    console.error(error);
    const response: ApiResponse<null> = {
      data: null,
      msg: "创建任务失败",
      code: 1,
    };
    res.status(500).json(response);
  }
};

export const getTask: RequestHandler = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    const response: ApiResponse<null> = {
      data: null,
      msg: "Invalid task ID",
      code: 1,
    };
    res.status(400).json(response);
    return;
  }

  try {
    const task = await getTaskById(id);
    if (!task) {
      const response: ApiResponse<null> = {
        data: null,
        msg: "Task not found",
        code: 1,
      };
      res.status(404).json(response);
      return;
    }
    const response: ApiResponse<Task> = {
      data: task,
      msg: "Success",
      code: 0,
    };
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    const response: ApiResponse<null> = {
      data: null,
      msg: "Error fetching task",
      code: 1,
    };
    res.status(500).json(response);
  }
};

export const updateTaskById: RequestHandler = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    const response: ApiResponse<null> = {
      data: null,
      msg: "Invalid task ID",
      code: 1,
    };
    res.status(400).json(response);
    return;
  }

  const updates = req.body as Partial<Task>;
  if (Object.keys(updates).length === 0) {
    const response: ApiResponse<null> = {
      data: null,
      msg: "No update data provided",
      code: 1,
    };
    res.status(400).json(response);
    return;
  }

  try {
    const taskExists = await getTaskById(id);
    if (!taskExists) {
      const response: ApiResponse<null> = {
        data: null,
        msg: "Task not found",
        code: 1,
      };
      res.status(404).json(response);
      return;
    }

    const result = await updateTask(id, updates);
    if (!result) {
      const response: ApiResponse<null> = {
        data: null,
        msg: "Update failed",
        code: 1,
      };
      res.status(400).json(response);
      return;
    }

    const updatedTask = await getTaskById(id);
    if (!updatedTask) {
      const response: ApiResponse<null> = {
        data: null,
        msg: "Task not found after update",
        code: 1,
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse<Task> = {
      data: updatedTask,
      msg: "Success",
      code: 0,
    };
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    const response: ApiResponse<null> = {
      data: null,
      msg: "Error updating task",
      code: 1,
    };
    res.status(500).json(response);
  }
};

export const deleteTaskById: RequestHandler = async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    const response: ApiResponse<null> = {
      data: null,
      msg: "Invalid task ID",
      code: 1,
    };
    res.status(400).json(response);
    return;
  }

  try {
    const taskExists = await getTaskById(id);
    if (!taskExists) {
      const response: ApiResponse<null> = {
        data: null,
        msg: "Task not found",
        code: 1,
      };
      res.status(404).json(response);
      return;
    }

    const result = await deleteTask(id);
    if (!result) {
      const response: ApiResponse<null> = {
        data: null,
        msg: "Delete failed",
        code: 1,
      };
      res.status(400).json(response);
      return;
    }

    const response: ApiResponse<null> = {
      data: null,
      msg: "Success",
      code: 0,
    };
    res.status(204).json(response);
  } catch (error) {
    console.error(error);
    const response: ApiResponse<null> = {
      data: null,
      msg: "Error deleting task",
      code: 1,
    };
    res.status(500).json(response);
  }
};
