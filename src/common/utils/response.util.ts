import { HttpStatus } from '@nestjs/common';
import { ApiResponse } from '../interfaces/response.interface';

/**
 * 响应工具类
 * 提供创建各种类型响应的静态方法
 */
export class ResponseUtil {
  /**
   * 创建成功响应
   * @param data 响应数据
   * @param msg 响应消息
   * @returns ApiResponse对象
   */
  static success<T>(data: T, msg = '请求成功'): ApiResponse<T> {
    return {
      code: HttpStatus.OK,
      data,
      msg,
    };
  }

  /**
   * 创建错误响应
   * @param msg 错误消息
   * @param code 错误码
   * @returns ApiResponse对象
   */
  static error(msg = '请求失败', code = HttpStatus.BAD_REQUEST): ApiResponse<null> {
    return {
      code,
      data: null,
      msg,
    };
  }

  /**
   * 创建自定义响应
   * @param code 状态码
   * @param data 响应数据
   * @param msg 响应消息
   * @returns ApiResponse对象
   */
  static create<T>(code: number, data: T, msg: string): ApiResponse<T> {
    return {
      code,
      data,
      msg,
    };
  }
}
