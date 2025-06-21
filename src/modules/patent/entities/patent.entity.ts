import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('patents')
export class Patent {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: '专利ID' })
  id: number;

  @Column()
  @ApiProperty({ description: '专利名称' })
  name: string;

  @Column()
  @ApiProperty({ description: '专利类型', example: 1 })
  type: number;

  @Column()
  @ApiProperty({ description: '专利图片URL' })
  imageUrl: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '专利图片ID（关联上传文件ID）' })
  imageId: number;

  @CreateDateColumn()
  @ApiProperty({ description: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: '更新时间' })
  updatedAt: Date;
}
