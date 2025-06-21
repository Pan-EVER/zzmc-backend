import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('uploads')
export class Upload {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '文件ID' })
  id: number;

  @Column()
  @ApiProperty({ description: '文件原始名称' })
  originalName: string;

  @Column()
  @ApiProperty({ description: '文件存储路径' })
  path: string;

  @Column()
  @ApiProperty({ description: '文件类型' })
  mimeType: string;

  @Column()
  @ApiProperty({ description: '文件大小（字节）' })
  size: number;

  @Column()
  @ApiProperty({ description: '文件访问URL' })
  url: string;

  @CreateDateColumn()
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;
}
