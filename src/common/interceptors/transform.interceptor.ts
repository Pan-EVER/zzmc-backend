import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/response.interface';

/**
 * 响应转换拦截器
 * 将所有响应数据统一包装为 { code, data, msg } 格式
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        // 如果返回的数据已经是ApiResponse格式，则不做处理
        if (data && typeof data === 'object' && 'code' in data && 'data' in data && 'msg' in data) {
          return data as ApiResponse<T>;
        }

        // 否则包装为ApiResponse格式
        return {
          code: 200,
          data,
          msg: '请求成功',
        };
      }),
    );
  }
}
