import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { Upload } from './entities/upload.entity';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([Upload]),
    ConfigModule,
    ServeStaticModule.forRoot({
      rootPath:
        process.env.NODE_ENV === 'production'
          ? '/var/uploads/website'
          : 'D:\\upload_storage\\website',
      serveRoot: '/uploads',
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
