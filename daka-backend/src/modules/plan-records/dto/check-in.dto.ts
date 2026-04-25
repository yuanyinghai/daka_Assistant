import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class CheckInDto {
  @ApiProperty({ description: '打卡备注', required: false })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({ description: '实际学习时长（分钟）', required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  actualDuration?: number;

  @ApiProperty({ description: '附件图片URL数组', required: false })
  @IsOptional()
  attachments?: string[];
}
