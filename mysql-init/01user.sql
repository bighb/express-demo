

-- id：用户唯一标识，自动递增。
-- username：用户名，不能重复。
-- password：密码（加密后存储，后面用 bcrypt 处理）。
-- role：角色，用于授权，默认为普通用户 user，也可以是 admin。
-- created_at：创建时间，自动记录。
-- updated_at：更新时间，自动更新。
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);