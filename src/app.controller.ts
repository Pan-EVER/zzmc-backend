import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { ApiResponseDecorator } from './common/decorators/api-response.decorator';

@ApiTags('系统')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: '系统欢迎信息' })
  @ApiResponseDecorator(String)
  getHello(): string {
    return this.appService.getHello();
  }
}
