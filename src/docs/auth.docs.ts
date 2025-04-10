/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: 用户ID
 *         username:
 *           type: string
 *           description: 用户名
 *         role:
 *           type: string
 *           description: 用户角色
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 *   responses:
 *     RegisterResponse:
 *       description: 用户注册响应
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: 用户创建成功
 *               userId:
 *                 type: string
 *                 description: 创建的用户ID
 *     LoginResponse:
 *       description: 用户登录响应
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: 登录成功
 *               token:
 *                 type: string
 *                 description: JWT认证令牌
 */

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: 用户认证相关接口
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: 用户注册
 *     description: 创建新用户账号
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: 用户名
 *               password:
 *                 type: string
 *                 description: 密码
 *               role:
 *                 type: string
 *                 description: 用户角色
 *     responses:
 *       201:
 *         $ref: '#/components/responses/RegisterResponse'
 *       400:
 *         description: 请求参数错误
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 用户名和密码必填
 *       500:
 *         description: 服务器错误
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 创建用户失败
 *                 error:
 *                   type: object
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: 用户登录
 *     description: 验证用户凭据并返回JWT令牌
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: 用户名
 *               password:
 *                 type: string
 *                 description: 密码
 *     responses:
 *       200:
 *         $ref: '#/components/responses/LoginResponse'
 *       400:
 *         description: 请求参数错误
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 用户名和密码必填
 *       401:
 *         description: 认证失败
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 用户名或密码错误
 *       500:
 *         description: 服务器错误
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 登录失败
 *                 error:
 *                   type: object
 */
