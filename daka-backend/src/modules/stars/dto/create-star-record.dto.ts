import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsOptional, Min } from 'class-validator';
import { StarRecordType } from '../../../entities/star-record.entity';

export class CreateStarRecordDto {
  @ApiProperty({ description: '用户ID' })
  @IsString()
  userId: string;

  @ApiProperty({ description: '星星数量', minimum: 1 })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({ description: '类型', enum: StarRecordType, example: StarRecordType.EARN })
  @IsEnum(StarRecordType)
  type: StarRecordType;

  @ApiProperty({ description: '来源', example: 'plan_complete' })
  @IsString()
  source: string;

  @ApiProperty({ description: '来源ID', required: false })
  @IsString()
  @IsOptional()
  sourceId?: string;

  @ApiProperty({ description: '描述', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
