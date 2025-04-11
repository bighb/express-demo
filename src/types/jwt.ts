// 定义JWT载荷的接口结构
// 包含用户ID和角色信息，用于识别和授权用户
export interface JwtPayload {
  id: number; // 用户唯一标识符
  role: string; // 用户角色，用于权限控制
  iat: number; // 令牌签发时间
  exp: number; // 令牌过期时间
}
