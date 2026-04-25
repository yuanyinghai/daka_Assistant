import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class JoinFamilyDto {
  @ApiProperty({ description: '邀请码', example: 'ABC123' })
  @IsString()
  @Length(6, 6, { message: '邀请码必须为6位' })
  inviteCode: string;
}
