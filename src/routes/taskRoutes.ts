import { Router } from "express";
import {
  getTasks,
  addTask,
  getTask,
  updateTaskById,
  deleteTaskById,
} from "../controllers/taskController";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         id:
 *           type: string
 *           description: 任务ID
 *         title:
 *           type: string
 *           description: 任务名称
 *         description:
 *           type: string
 *           description: 任务描述
 *         completed:
 *           type: boolean
 *           description: 任务是否完成
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 更新时间
 *   responses:
 *     TaskResponse:
 *       description: 任务响应结构
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 $ref: '#/components/schemas/Task'
 *               msg:
 *                 type: string
 *                 description: 响应消息
 *               code:
 *                 type: integer
 *                 description: 状态码
 *     TaskListResponse:
 *       description: 任务列表响应结构
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Task'
 *               msg:
 *                 type: string
 *                 description: 响应消息
 *               code:
 *                 type: integer
 *                 description: 状态码
 */

/**
 * @swagger
 * tags:
 *   - name: Tasks
 *     description: 任务管理相关接口
 */

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: 获取所有任务
 *     description: 返回所有任务的列表
 *     responses:
 *       200:
 *         $ref: '#/components/responses/TaskListResponse'
 */
router.get("/tasks", getTasks);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     tags: [Tasks]
 *     summary: 创建新任务
 *     description: 创建并返回新任务
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 description: 任务名称
 *               description:
 *                 type: string
 *                 description: 任务描述
 *     responses:
 *       201:
 *         $ref: '#/components/responses/TaskResponse'
 */
router.post("/tasks", addTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     tags: [Tasks]
 *     summary: 获取单个任务
 *     description: 根据ID获取单个任务
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 任务ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         $ref: '#/components/responses/TaskResponse'
 *       404:
 *         description: 任务不存在
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: 任务不存在
 *                 code:
 *                   type: integer
 *                   example: 404
 */
router.get("/tasks/:id", getTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     tags: [Tasks]
 *     summary: 更新任务
 *     description: 根据ID更新任务
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 任务ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 任务名称
 *               description:
 *                 type: string
 *                 description: 任务描述
 *               completed:
 *                 type: boolean
 *                 description: 任务是否完成
 *     responses:
 *       200:
 *         $ref: '#/components/responses/TaskResponse'
 *       404:
 *         description: 任务不存在
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: 任务不存在
 *                 code:
 *                   type: integer
 *                   example: 404
 */
router.put("/tasks/:id", updateTaskById);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     tags: [Tasks]
 *     summary: 删除任务
 *     description: 根据ID删除任务
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 任务ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 成功删除任务
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: 任务删除成功
 *                 code:
 *                   type: integer
 *                   example: 200
 *       404:
 *         description: 任务不存在
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: 任务不存在
 *                 code:
 *                   type: integer
 *                   example: 404
 */
router.delete("/tasks/:id", deleteTaskById);

export default router;
