import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Upload } from './entities/upload.entity';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(Upload)
    private uploadRepository: Repository<Upload>,
    private configService: ConfigService,
  ) {}

  private getUploadPath(): string {
    const isProd = process.env.NODE_ENV === 'production';
    return isProd ? '/var/uploads/website' : 'D:\\upload_storage\\website';
  }

  private ensureUploadDirectory(uploadPath: string): void {
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
  }

  private generateUniqueFileName(originalName: string): string {
    const timestamp = Date.now();
    const hash = crypto.createHash('md5').update(`${originalName}${timestamp}`).digest('hex');
    const ext = path.extname(originalName);
    return `${hash}${ext}`;
  }

  async uploadFile(file: Express.Multer.File): Promise<Upload> {
    const uploadPath = this.getUploadPath();
    this.ensureUploadDirectory(uploadPath);

    const fileName = this.generateUniqueFileName(file.originalname);
    const filePath = path.join(uploadPath, fileName);

    // 写入文件
    fs.writeFileSync(filePath, file.buffer);

    // 创建文件记录
    const upload = new Upload();
    upload.originalName = file.originalname;
    upload.path = filePath;
    upload.mimeType = file.mimetype;
    upload.size = file.size;
    upload.url = `/uploads/${fileName}`; // 这里需要配置静态文件服务

    return this.uploadRepository.save(upload);
  }

  async findAll(): Promise<Upload[]> {
    return this.uploadRepository.find();
  }

  async findOne(id: number): Promise<Upload | null> {
    return this.uploadRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    const upload = await this.findOne(id);
    if (upload) {
      // 删除物理文件
      if (fs.existsSync(upload.path)) {
        fs.unlinkSync(upload.path);
      }
      await this.uploadRepository.remove(upload);
    }
  }
}
