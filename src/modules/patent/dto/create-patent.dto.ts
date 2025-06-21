import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreatePatentDto {
  @ApiProperty({ description: '专利名称' })
  @IsString()
  @IsNotEmpty({ message: '专利名称不能为空' })
  name: string;

  @ApiProperty({ description: '专利类型', example: 1 })
  @IsNumber()
  @IsNotEmpty({ message: '专利类型不能为空' })
  type: number;

  @ApiProperty({ description: '专利图片ID（关联上传文件ID）' })
  @IsNumber()
  @IsNotEmpty({ message: '专利图片不能为空' })
  imageId: number;
}
