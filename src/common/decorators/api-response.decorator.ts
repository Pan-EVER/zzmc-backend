import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { ApiResponse } from '../interfaces/response.interface';

/**
 * 用于Swagger文档的API响应模型
 */
export class ApiResponseDto<T> implements ApiResponse<T> {
  @ApiProperty({ description: '状态码', example: 200 })
  code: number;

  @ApiProperty({ description: '响应数据' })
  data: T;

  @ApiProperty({ description: '响应消息', example: '请求成功' })
  msg: string;
}

/**
 * 自定义API响应装饰器
 * 用于在Swagger文档中展示统一的响应格式
 * @param dataDto 响应数据的DTO类型
 * @param isArray 响应数据是否为数组
 */
export const ApiResponseDecorator = <T extends Type<any>>(dataDto: T, isArray = false) => {
  return applyDecorators(
    ApiExtraModels(ApiResponseDto, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              data: isArray
                ? {
                    type: 'array',
                    items: { $ref: getSchemaPath(dataDto) },
                  }
                : {
                    $ref: getSchemaPath(dataDto),
                  },
            },
          },
        ],
      },
    }),
  );
};
