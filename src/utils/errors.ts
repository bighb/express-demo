export class AppError extends Error {
  public statusCode: number;
  public code: number;
  public isOperational: boolean;

  constructor(
    message: string,
    statusCode: number,
    code: number = 1,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational; // 是否是操作型错误，用于区分程序bug和预期内的错误

    Error.captureStackTrace(this, this.constructor);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, error?: any) {
    super(
      `数据库错误: ${message}${
        error ? ` - ${error.message || JSON.stringify(error)}` : ""
      }`,
      500,
      1001
    );
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 1002);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`资源不存在: ${resource}`, 404, 1003);
  }
}
