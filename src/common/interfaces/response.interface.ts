/**
 * 统一API响应接口
 */
export interface ApiResponse<T> {
  /**
   * 状态码
   * 200: 成功
   * 400: 客户端错误
   * 401: 未授权
   * 403: 禁止访问
   * 404: 资源不存在
   * 500: 服务器错误
   */
  code: number;

  /**
   * 响应数据
   */
  data: T;

  /**
   * 响应消息
   */
  msg: string;
}
