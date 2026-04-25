import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, Length } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ description: '昵称', example: '小明', required: false })
  @IsString()
  @IsOptional()
  @Length(1, 50, { message: '昵称长度必须在1-50位之间' })
  nickname?: string;

  @ApiProperty({ description: '头像URL', required: false })
  @IsString()
  @IsOptional()
  avatarUrl?: string;
}
