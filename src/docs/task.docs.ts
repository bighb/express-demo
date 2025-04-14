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
 *           type: integer
 *           description: 任务ID
 *         title:
 *           type: string
 *           description: 任务名称
 *         description:
 *           type: string
 *           description: 任务描述
 *         status:
 *           type: string
 *           enum: [pending, in_progress, completed]
 *           description: 任务状态
 *         user_id:
 *           type: integer
 *           description: 关联的用户ID
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
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
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
 *     summary: 获取任务列表
 *     description: |
 *       根据用户角色返回不同结果：
 *       - 管理员: 返回所有任务
 *       - 普通用户: 仅返回用户自己的任务
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         $ref: '#/components/responses/TaskListResponse'
 *       401:
 *         description: 未授权，需要登录
 *       500:
 *         description: 服务器错误
 */

/**
 * @swagger
 * /api/users/{userId}/tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: 获取指定用户的任务
 *     description: 获取特定用户的所有任务，仅管理员可用
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: 用户ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         $ref: '#/components/responses/TaskListResponse'
 *       401:
 *         description: 未授权，需要登录
 *       403:
 *         description: 权限不足，需要管理员权限
 *       500:
 *         description: 服务器错误
 */

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     tags: [Tasks]
 *     summary: 创建新任务
 *     description: 创建新任务并自动关联到当前登录用户
 *     security:
 *       - bearerAuth: []
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
 *               status:
 *                 oneOf:
 *                   - type: string
 *                     enum: [pending, in_progress, completed]
 *                   - type: integer
 *                     enum: [1, 2, 3]
 *                 description: |
 *                   任务状态，可以是字符串或数字：
 *                   - pending/1: 待处理
 *                   - in_progress/2: 进行中
 *                   - completed/3: 已完成
 *     responses:
 *       201:
 *         $ref: '#/components/responses/TaskResponse'
 *       400:
 *         description: 请求参数错误
 *       401:
 *         description: 未授权，需要登录
 *       500:
 *         description: 服务器错误
 */

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     tags: [Tasks]
 *     summary: 获取单个任务
 *     description: |
 *       根据ID获取单个任务：
 *       - 管理员可以查看任何任务
 *       - 普通用户只能查看自己的任务
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 任务ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         $ref: '#/components/responses/TaskResponse'
 *       401:
 *         description: 未授权，需要登录
 *       403:
 *         description: 权限不足，不能查看其他用户的任务
 *       404:
 *         description: 任务不存在
 *       500:
 *         description: 服务器错误
 */

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     tags: [Tasks]
 *     summary: 更新任务
 *     description: |
 *       根据ID更新任务：
 *       - 管理员可以更新任何任务
 *       - 普通用户只能更新自己的任务
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 任务ID
 *         schema:
 *           type: integer
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
 *               status:
 *                 oneOf:
 *                   - type: string
 *                     enum: [pending, in_progress, completed]
 *                   - type: integer
 *                     enum: [1, 2, 3]
 *                 description: |
 *                   任务状态，可以是字符串或数字：
 *                   - pending/1: 待处理
 *                   - in_progress/2: 进行中
 *                   - completed/3: 已完成
 *     responses:
 *       200:
 *         $ref: '#/components/responses/TaskResponse'
 *       400:
 *         description: 请求参数错误
 *       401:
 *         description: 未授权，需要登录
 *       403:
 *         description: 权限不足，不能更新其他用户的任务
 *       404:
 *         description: 任务不存在
 *       500:
 *         description: 服务器错误
 */

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     tags: [Tasks]
 *     summary: 删除任务
 *     description: |
 *       根据ID删除任务：
 *       - 管理员可以删除任何任务
 *       - 普通用户只能删除自己的任务
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: 任务ID
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: 成功删除任务
 *       401:
 *         description: 未授权，需要登录
 *       403:
 *         description: 权限不足，不能删除其他用户的任务
 *       404:
 *         description: 任务不存在
 *       500:
 *         description: 服务器错误
 */
