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
import { AppError, ValidationError, NotFoundError } from "../utils/errors";
import logger from "../utils/logger";

/**
 * 获取所有任务
 */
export const getTasks: RequestHandler = async (req, res, next) => {
  try {
    const tasks = await getAllTasks();

    const response: ApiResponse<Task[]> = {
      data: tasks,
      msg: "获取任务列表成功",
      code: 0,
    };

    res.status(200).json(response);
  } catch (error) {
    logger.error(
      `获取任务列表失败: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    next(error);
  }
};

/**
 * 添加新任务
 */
export const addTask: RequestHandler = async (req, res, next) => {
  try {
    const { title, description, status } = req.body as Task;

    // 验证标题
    if (!title || title.trim() === "") {
      throw new ValidationError("标题是必填项");
    }

    // 验证和转换状态
    const validStatuses = ["pending", "in_progress", "completed"];
    let taskStatus: Task["status"] = "pending"; // 默认值

    if (status !== undefined) {
      if (typeof status === "number") {
        const statusMap: Record<number, Task["status"]> = {
          1: "pending",
          2: "in_progress",
          3: "completed",
        };
        if (!statusMap[status]) {
          throw new ValidationError(
            `状态值无效: ${status}，有效的数字状态为 1, 2, 3`
          );
        }
        taskStatus = statusMap[status];
      } else if (validStatuses.includes(status as any)) {
        taskStatus = status as Task["status"];
      } else {
        throw new ValidationError(
          `状态值无效: ${status}，有效的状态为 pending, in_progress, completed`
        );
      }
    }

    const task: Task = {
      title: title.trim(),
      description: description?.trim() || undefined,
      status: taskStatus,
    };

    logger.info(`开始创建任务: ${JSON.stringify(task)}`);
    const taskId = await createTask(task);
    logger.info(`任务创建成功: ID=${taskId}, 标题="${title}"`);

    const response: ApiResponse<{ id: number } & Task> = {
      data: { id: taskId, ...task },
      msg: "任务创建成功",
      code: 0,
    };

    res.status(201).json(response);
  } catch (error) {
    logger.error(
      `创建任务失败: ${error instanceof Error ? error.message : String(error)}`
    );
    next(error);
  }
};

/**
 * 根据ID获取任务
 */
export const getTask: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      throw new ValidationError(`无效的任务ID: ${req.params.id}`);
    }

    const task = await getTaskById(id);

    if (!task) {
      throw new NotFoundError(`未找到ID为${id}的任务`);
    }

    const response: ApiResponse<Task> = {
      data: task,
      msg: "获取任务成功",
      code: 0,
    };

    res.status(200).json(response);
  } catch (error) {
    logger.error(
      `获取任务失败: ${error instanceof Error ? error.message : String(error)}`
    );
    next(error);
  }
};

/**
 * 更新任务
 */
export const updateTaskById: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      throw new ValidationError(`无效的任务ID: ${req.params.id}`);
    }

    const updates = req.body as Partial<Task>;

    if (Object.keys(updates).length === 0) {
      throw new ValidationError("未提供任何更新数据");
    }

    // 验证标题不能为空
    if (
      updates.title !== undefined &&
      (!updates.title || updates.title.trim() === "")
    ) {
      throw new ValidationError("标题不能为空");
    }
    const { status } = updates;

    // 验证状态值是否有效
    if (updates.status !== undefined) {
      const validStatuses = ["pending", "in_progress", "completed"];
      let taskStatus: Task["status"] = "pending"; // 默认值
      if (status !== undefined) {
        if (typeof status === "number") {
          const statusMap: Record<number, Task["status"]> = {
            1: "pending",
            2: "in_progress",
            3: "completed",
          };
          if (!statusMap[status]) {
            throw new ValidationError(
              `状态值无效: ${status}，有效的数字状态为 1, 2, 3`
            );
          }
          taskStatus = statusMap[status];
        } else if (validStatuses.includes(status as any)) {
          taskStatus = status as Task["status"];
        } else {
          throw new ValidationError(
            `状态值无效: ${status}，有效的状态为 pending, in_progress, completed`
          );
        }
      }
    }

    // 检查任务是否存在
    const taskExists = await getTaskById(id);
    if (!taskExists) {
      throw new NotFoundError(`未找到ID为${id}的任务`);
    }

    logger.info(`开始更新任务ID ${id}: ${JSON.stringify(updates)}`);
    const result = await updateTask(id, updates);

    if (!result) {
      throw new AppError(`更新任务ID ${id}失败`, 500);
    }

    const updatedTask = await getTaskById(id);
    if (!updatedTask) {
      throw new NotFoundError(`更新后未找到ID为${id}的任务`);
    }

    logger.info(`任务ID ${id}更新成功`);
    const response: ApiResponse<Task> = {
      data: updatedTask,
      msg: "任务更新成功",
      code: 0,
    };

    res.status(200).json(response);
  } catch (error) {
    logger.error(
      `更新任务失败: ${error instanceof Error ? error.message : String(error)}`
    );
    next(error);
  }
};

/**
 * 删除任务
 */
export const deleteTaskById: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      throw new ValidationError(`无效的任务ID: ${req.params.id}`);
    }

    // 检查任务是否存在
    const taskExists = await getTaskById(id);
    if (!taskExists) {
      throw new NotFoundError(`未找到ID为${id}的任务`);
    }

    logger.info(`开始删除任务ID ${id}`);
    const result = await deleteTask(id);

    if (!result) {
      throw new AppError(`删除任务ID ${id}失败`, 500);
    }

    logger.info(`任务ID ${id}删除成功`);
    const response: ApiResponse<null> = {
      data: null,
      msg: "任务删除成功",
      code: 0,
    };

    // 使用204状态码表示成功但无内容返回
    res.status(204).json(response);
  } catch (error) {
    logger.error(
      `删除任务失败: ${error instanceof Error ? error.message : String(error)}`
    );
    next(error);
  }
};
