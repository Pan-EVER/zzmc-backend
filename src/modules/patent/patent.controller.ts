import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { PatentService } from './patent.service';
import { CreatePatentDto } from './dto/create-patent.dto';
import { UpdatePatentDto } from './dto/update-patent.dto';
import { Patent } from './entities/patent.entity';

@ApiTags('专利管理')
@Controller('patent')
export class PatentController {
  constructor(private readonly patentService: PatentService) {}

  @Post()
  @ApiOperation({ summary: '创建专利' })
  async create(@Body() createPatentDto: CreatePatentDto): Promise<Patent> {
    return this.patentService.create(createPatentDto);
  }

  @Get()
  @ApiOperation({ summary: '获取所有专利' })
  async findAll(): Promise<Patent[]> {
    return this.patentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取指定专利' })
  @ApiParam({ name: 'id', description: '专利ID' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Patent> {
    return this.patentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新专利' })
  @ApiParam({ name: 'id', description: '专利ID' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePatentDto: UpdatePatentDto,
  ): Promise<Patent> {
    return this.patentService.update(id, updatePatentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除专利' })
  @ApiParam({ name: 'id', description: '专利ID' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.patentService.remove(id);
  }
}
