import { executeQuery } from "../config/db";
import { Task } from "../types/task";
import logger from "../utils/logger";
import { DatabaseError, NotFoundError } from "../utils/errors";

export const getAllTasks = async (): Promise<Task[]> => {
  try {
    const [rows] = await executeQuery("SELECT * FROM tasks");
    return rows as Task[];
  } catch (error) {
    logger.error(
      `获取所有任务失败: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    throw error instanceof DatabaseError
      ? error
      : new DatabaseError("获取任务列表失败", error);
  }
};

export const createTask = async (task: Task): Promise<number> => {
  logger.info(`创建任务: ${JSON.stringify(task)}`);
  try {
    const [result] = await executeQuery(
      "INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)",
      [task.title, task.description || null, task.status || "pending"]
    );
    const insertId = (result as any).insertId;
    logger.info(`任务创建成功, ID: ${insertId}`);
    return insertId;
  } catch (error) {
    logger.error(
      `创建任务失败: ${error instanceof Error ? error.message : String(error)}`
    );
    throw error instanceof DatabaseError
      ? error
      : new DatabaseError("创建任务失败", error);
  }
};

export const getTaskById = async (id: number): Promise<Task | null> => {
  try {
    const [rows] = await executeQuery("SELECT * FROM tasks WHERE id = ?", [id]);
    const tasks = rows as Task[];
    if (tasks.length === 0) {
      logger.info(`未找到ID为${id}的任务`);
      return null;
    }
    return tasks[0];
  } catch (error) {
    logger.error(
      `获取任务ID ${id}失败: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    throw error instanceof DatabaseError
      ? error
      : new DatabaseError(`获取任务ID ${id}失败`, error);
  }
};

export const updateTask = async (
  id: number,
  task: Partial<Task>
): Promise<Task | null> => {
  logger.info(`更新任务ID ${id}: ${JSON.stringify(task)}`);
  try {
    const [result] = await executeQuery(
      "UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?",
      [task.title, task.description || null, task.status || null, id]
    );
    const affectedRows = (result as any).affectedRows;
    if (affectedRows === 0) {
      logger.info(`未找到ID为${id}的任务`);
      throw new NotFoundError(`未找到ID为${id}的任务`);
    }
    const [rows] = await executeQuery("SELECT * FROM tasks WHERE id = ?", [id]);
    const updatedTask = rows as Task[];
    if (updatedTask.length === 0) {
      logger.info(`未找到ID为${id}的任务`);
      return null;
    }
    logger.info(`任务ID ${id}更新成功`);
    return updatedTask[0];
  } catch (error) {
    logger.error(
      `更新任务ID ${id}失败: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    throw error instanceof DatabaseError
      ? error
      : new DatabaseError(`更新任务ID ${id}失败`, error);
  }
};

export const deleteTask = async (id: number): Promise<boolean> => {
  logger.info(`删除任务ID ${id}`);
  try {
    const [result] = await executeQuery("DELETE FROM tasks WHERE id = ?", [id]);
    const affectedRows = (result as any).affectedRows;
    if (affectedRows === 0) {
      logger.info(`未找到ID为${id}的任务`);
      throw new NotFoundError(`未找到ID为${id}的任务`);
    }
    logger.info(`任务ID ${id}删除成功`);
    return true;
  } catch (error) {
    logger.error(
      `删除任务ID ${id}失败: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    throw error instanceof DatabaseError
      ? error
      : new DatabaseError(`删除任务ID ${id}失败`, error);
  }
};
