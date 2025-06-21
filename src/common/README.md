# 统一API响应格式

## 概述

本项目实现了统一的API响应格式，所有API响应都会被包装为以下格式：

```json
{
  "code": 200, // 状态码
  "data": {}, // 响应数据
  "msg": "请求成功" // 响应消息
}
```

## 实现方式

统一响应格式通过以下组件实现：

1. **响应接口**：`ApiResponse<T>` 定义了统一的响应格式
2. **响应转换拦截器**：`TransformInterceptor` 自动将控制器返回的数据包装为统一格式
3. **全局异常过滤器**：`HttpExceptionFilter` 捕获异常并转换为统一的错误响应格式
4. **响应工具类**：`ResponseUtil` 提供创建各种类型响应的静态方法
5. **Swagger响应装饰器**：`ApiResponseDecorator` 为API端点添加正确的Swagger响应模型

## 使用方法

### 控制器返回数据

控制器方法可以直接返回原始数据，拦截器会自动将其包装为统一格式：

```typescript
@Get()
async findAll(): Promise<Entity[]> {
  return this.service.findAll();
}
```

响应结果：

```json
{
  "code": 200,
  "data": [...],
  "msg": "请求成功"
}
```

### 手动构建响应

如果需要自定义响应消息或状态码，可以使用`ResponseUtil`：

```typescript
@Get()
async findAll(): Promise<ApiResponse<Entity[]>> {
  const data = await this.service.findAll();
  return ResponseUtil.success(data, '获取列表成功');
}
```

### 错误处理

抛出的异常会被自动捕获并转换为统一的错误响应格式：

```typescript
@Get(':id')
async findOne(@Param('id') id: number): Promise<Entity> {
  const entity = await this.service.findOne(id);
  if (!entity) {
    throw new NotFoundException(`ID为${id}的资源不存在`);
  }
  return entity;
}
```

错误响应：

```json
{
  "code": 404,
  "data": null,
  "msg": "ID为1的资源不存在"
}
```

### Swagger文档

使用`ApiResponseDecorator`装饰器为API端点添加正确的Swagger响应模型：

```typescript
@Get()
@ApiOperation({ summary: '获取所有资源' })
@ApiResponseDecorator(Entity, true) // true表示返回数组
async findAll(): Promise<Entity[]> {
  return this.service.findAll();
}
```

## 最佳实践

1. 控制器方法返回类型应该与实际返回的数据类型一致
2. 使用`ApiResponseDecorator`装饰器为所有API端点添加Swagger响应模型
3. 对于需要自定义响应消息的情况，使用`ResponseUtil`手动构建响应
4. 使用NestJS内置的异常类（如`NotFoundException`、`BadRequestException`等）抛出异常
