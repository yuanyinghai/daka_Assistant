import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, IsOptional } from 'class-validator';

export class ReviewDto {
  @ApiProperty({ description: '是否通过审核' })
  @IsBoolean()
  approved: boolean;

  @ApiProperty({ description: '审核备注', required: false })
  @IsString()
  @IsOptional()
  note?: string;
}
