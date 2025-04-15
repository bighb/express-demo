-- 字段设计：
-- id：任务唯一标识，自增主键。
-- title：任务标题，必填，最长 255 个字符。
-- description：任务描述，可选，允许长文本。
-- status：任务状态，使用枚举类型，默认值为 "pending"。
-- created_at：任务创建时间，自动设置为当前时间。
-- updated_at：任务更新时间，自动更新为当前时间。
-- 设计思路：
-- 字段简洁但足以支持任务管理需求。
-- 使用 TIMESTAMP 追踪任务的时间状态，便于审计和排序。
-- ENUM 限制 status 的值，确保数据一致性。

-- 创建数据库
CREATE DATABASE IF NOT EXISTS task_manager;

-- 使用数据库
USE task_manager;

-- 创建任务表
CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 修改 tasks 表添加 user_id 外键 让任务与用户关联
ALTER TABLE tasks 
ADD COLUMN user_id INT NOT NULL,
ADD CONSTRAINT fk_user_task 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;