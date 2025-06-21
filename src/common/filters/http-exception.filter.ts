import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from '../interfaces/response.interface';

/**
 * 全局HTTP异常过滤器
 * 捕获所有异常并转换为统一的错误响应格式
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 获取异常状态码和消息
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '服务器内部错误';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // 处理验证错误等复杂响应
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        message =
          (exceptionResponse as any).message ||
          (exceptionResponse as any).error ||
          exception.message ||
          message;

        // 如果message是数组，取第一个错误信息
        if (Array.isArray(message)) {
          message = message[0];
        }
      } else if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else {
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(`未处理的异常: ${exception.message}`, exception.stack);
    } else {
      this.logger.error('未知异常', exception);
    }

    // 构建错误响应
    const errorResponse: ApiResponse<null> = {
      code: statusCode,
      data: null,
      msg: message,
    };

    // 记录错误日志
    this.logger.error(
      `${request.method} ${request.url} - ${statusCode}: ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    // 发送响应
    response.status(statusCode).json(errorResponse);
  }
}
