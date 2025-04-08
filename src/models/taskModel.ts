import pool from "../config/db"; // 引入数据库连接池
import { Task } from "../types/task";
// getAllTasks：查询所有任务，返回 Task[] 类型数组。
// createTask：插入新任务，返回新任务的 id。
// 使用参数化查询（?）防止 SQL 注入。

export const getAllTasks = async (): Promise<Task[]> => {
  const [rows] = await pool.query("SELECT * FROM tasks");
  return rows as Task[];
};

export const createTask = async (task: Task): Promise<number> => {
  console.log("task: ", task);
  const [result] = await pool.query(
    "INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)",
    [task.title, task.description || null, task.status || "pending"]
  );
  return (result as any).insertId;
};

export const getTaskById = async (id: number): Promise<Task | null> => {
  const [rows] = await pool.query("SELECT * FROM tasks WHERE id = ?", [id]);
  const tasks = rows as Task[];
  return tasks.length > 0 ? tasks[0] : null;
};

export const updateTask = async (
  id: number,
  task: Partial<Task>
): Promise<boolean> => {
  const fields = [];
  const values = [];

  if (task.title !== undefined) {
    fields.push("title = ?");
    values.push(task.title);
  }

  if (task.description !== undefined) {
    fields.push("description = ?");
    values.push(task.description);
  }

  if (task.status !== undefined) {
    fields.push("status = ?");
    values.push(task.status);
  }

  if (fields.length === 0) return false;

  values.push(id);

  const [result] = await pool.query(
    `UPDATE tasks SET ${fields.join(", ")} WHERE id = ?`,
    values
  );

  return (result as any).affectedRows > 0;
};

export const deleteTask = async (id: number): Promise<boolean> => {
  const [result] = await pool.query("DELETE FROM tasks WHERE id = ?", [id]);
  return (result as any).affectedRows > 0;
};
