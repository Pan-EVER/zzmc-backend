import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiParam } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { Upload } from './entities/upload.entity';
import { ApiResponseDecorator } from '../../../common/decorators/api-response.decorator';

@ApiTags('文件上传')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @ApiOperation({ summary: '上传文件' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: '要上传的文件',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponseDecorator(Upload)
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<Upload> {
    return this.uploadService.uploadFile(file);
  }

  @Get()
  @ApiOperation({ summary: '获取所有文件信息' })
  @ApiResponseDecorator(Upload, true)
  async findAll(): Promise<Upload[]> {
    return this.uploadService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取指定文件信息' })
  @ApiParam({ name: 'id', description: '文件ID' })
  @ApiResponseDecorator(Upload)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Upload> {
    const upload = await this.uploadService.findOne(id);
    if (!upload) {
      throw new NotFoundException(`文件ID ${id} 不存在`);
    }
    return upload;
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除文件' })
  @ApiParam({ name: 'id', description: '文件ID' })
  @ApiResponseDecorator(Object)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.uploadService.remove(id);
  }
}
