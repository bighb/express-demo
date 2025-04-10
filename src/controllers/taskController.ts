import { RequestHandler } from "express";
import {
  getAllTasks,
  getTasksByUserId,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
  isTaskOwnedByUser,
} from "../models/taskModel";
import { Task } from "../types/task";
import { ApiResponse } from "../types/response";
import { AppError, ValidationError, NotFoundError } from "../utils/errors";
import logger from "../utils/logger";

/**
 * 获取指定用户的任务 - 仅管理员可用
 */
export const getUserTasks: RequestHandler = async (req, res, next) => {
  try {
    const targetUserId = Number(req.params.userId);
    const userRole = req.user?.role;

    // 权限检查 - 只有管理员可以查看其他用户的任务
    if (userRole !== "admin") {
      throw new AppError("您无权查看其他用户的任务", 403);
    }

    if (isNaN(targetUserId)) {
      throw new ValidationError(`无效的用户ID: ${req.params.userId}`);
    }

    const tasks = await getTasksByUserId(targetUserId);

    const response: ApiResponse<Task[]> = {
      data: tasks,
      msg: `获取用户ID=${targetUserId}的任务列表成功`,
      code: 0,
    };

    res.status(200).json(response);
  } catch (error) {
    logger.error(
      `获取用户任务失败: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    next(error);
  }
};
/**
 * 获取任务列表 - 根据用户角色返回不同结果
 * 管理员: 所有任务
 * 普通用户: 只有自己的任务
 */
export const getTasks: RequestHandler = async (req, res, next) => {
  try {
    // 从认证中间件获取用户信息
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      throw new AppError("无法获取用户信息", 401);
    }

    let tasks: Task[];

    // 根据角色确定返回哪些任务
    if (userRole === "admin") {
      // 管理员可以看到所有任务
      tasks = await getAllTasks();
    } else {
      // 普通用户只能看到自己的任务
      tasks = await getTasksByUserId(userId);
    }

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
 * 添加新任务 - 自动关联到当前用户
 */
export const addTask: RequestHandler = async (req, res, next) => {
  try {
    const { title, description, status } = req.body as Task;
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("无法获取用户信息", 401);
    }

    // 验证标题
    if (!title || title.trim() === "") {
      throw new ValidationError("标题是必填项");
    }

    // 验证和转换状态
    const validStatuses = ["pending", "in_progress", "completed"];
    let taskStatus: Task["status"] = "pending"; // 默认值

    if (status !== undefined) {
      // 状态验证逻辑保持不变...
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

    // 创建任务对象，添加用户ID
    const task: Task = {
      title: title.trim(),
      description: description?.trim() || undefined,
      status: taskStatus,
      user_id: userId, // 自动关联当前用户
    };

    logger.info(`开始创建任务: ${JSON.stringify(task)}`);
    const taskId = await createTask(task);
    logger.info(
      `任务创建成功: ID=${taskId}, 标题="${title}", 用户ID=${userId}`
    );

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
 * 根据ID获取任务 - 检查任务所有权
 */
export const getTask: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      throw new AppError("无法获取用户信息", 401);
    }

    if (isNaN(id)) {
      throw new ValidationError(`无效的任务ID: ${req.params.id}`);
    }

    const task = await getTaskById(id);

    if (!task) {
      throw new NotFoundError(`未找到ID为${id}的任务`);
    }

    // 检查权限 - 只有任务所有者或管理员可以查看
    if (userRole !== "admin" && task.user_id !== userId) {
      throw new AppError("您无权查看此任务", 403);
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
 * 更新任务 - 增加权限验证
 */
export const updateTaskById: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      throw new AppError("无法获取用户信息", 401);
    }

    if (isNaN(id)) {
      throw new ValidationError(`无效的任务ID: ${req.params.id}`);
    }

    // 检查权限 - 只有任务所有者或管理员可以更新
    if (userRole !== "admin") {
      const isOwner = await isTaskOwnedByUser(id, userId);
      if (!isOwner) {
        throw new AppError("您无权更新此任务", 403);
      }
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

    // 只返回更新后的任务数据
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

    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      throw new AppError("无法获取用户信息", 401);
    }

    if (isNaN(id)) {
      throw new ValidationError(`无效的任务ID: ${req.params.id}`);
    }

    // 检查权限 - 只有任务所有者或管理员可以删除
    if (userRole !== "admin") {
      const isOwner = await isTaskOwnedByUser(id, userId);
      if (!isOwner) {
        throw new AppError("您无权删除此任务", 403);
      }
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
