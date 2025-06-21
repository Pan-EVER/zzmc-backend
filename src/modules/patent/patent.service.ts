import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patent } from './entities/patent.entity';
import { CreatePatentDto } from './dto/create-patent.dto';
import { UpdatePatentDto } from './dto/update-patent.dto';
import { UploadService } from '../tools/upload/upload.service';

@Injectable()
export class PatentService {
  constructor(
    @InjectRepository(Patent)
    private patentRepository: Repository<Patent>,
    private uploadService: UploadService,
  ) {}

  async create(createPatentDto: CreatePatentDto): Promise<Patent> {
    // 验证图片是否存在
    const upload = await this.uploadService.findOne(createPatentDto.imageId);
    if (!upload) {
      throw new NotFoundException(`图片ID ${createPatentDto.imageId} 不存在`);
    }

    const patent = this.patentRepository.create({
      ...createPatentDto,
      imageUrl: upload.url,
    });

    return this.patentRepository.save(patent);
  }

  async findAll(): Promise<Patent[]> {
    return this.patentRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<Patent> {
    const patent = await this.patentRepository.findOne({ where: { id } });
    if (!patent) {
      throw new NotFoundException(`专利ID ${id} 不存在`);
    }
    return patent;
  }

  async update(id: number, updatePatentDto: UpdatePatentDto): Promise<Patent> {
    const patent = await this.findOne(id);

    // 如果更新了图片，验证新图片是否存在并更新图片URL
    if (updatePatentDto.imageId) {
      const upload = await this.uploadService.findOne(updatePatentDto.imageId);
      if (!upload) {
        throw new NotFoundException(`图片ID ${updatePatentDto.imageId} 不存在`);
      }
      // 创建一个新对象，而不是直接修改DTO
      const patentData = {
        ...updatePatentDto,
        imageUrl: upload.url,
      };
      Object.assign(patent, patentData);
    } else {
      Object.assign(patent, updatePatentDto);
    }

    return this.patentRepository.save(patent);
  }

  async remove(id: number): Promise<void> {
    const patent = await this.findOne(id);
    await this.patentRepository.remove(patent);
  }
}
