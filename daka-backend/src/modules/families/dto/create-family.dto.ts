import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateFamilyDto {
  @ApiProperty({ description: '家庭名称', example: '小明家' })
  @IsString()
  @Length(1, 100, { message: '家庭名称长度必须在1-100位之间' })
  name: string;
}
