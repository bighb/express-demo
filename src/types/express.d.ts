import { JwtPayload } from "./jwt"; // 导入 JwtPayload
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
