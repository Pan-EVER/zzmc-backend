import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatentController } from './patent.controller';
import { PatentService } from './patent.service';
import { Patent } from './entities/patent.entity';
import { UploadModule } from '../tools/upload/upload.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Patent]),
    UploadModule, // 导入上传模块以使用其服务
  ],
  controllers: [PatentController],
  providers: [PatentService],
  exports: [PatentService],
})
export class PatentModule {}
