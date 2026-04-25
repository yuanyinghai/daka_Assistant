import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, Length, Matches } from 'class-validator';
import { UserRole } from '../../../entities/user.entity';

export class RegisterDto {
  @ApiProperty({ description: '手机号', example: '13800138000' })
  @IsString()
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' })
  phone: string;

  @ApiProperty({ description: '密码', example: '123456' })
  @IsString()
  @Length(6, 20, { message: '密码长度必须在6-20位之间' })
  password: string;

  @ApiProperty({ description: '昵称', example: '小明' })
  @IsString()
  @Length(1, 50, { message: '昵称长度必须在1-50位之间' })
  nickname: string;

  @ApiProperty({ description: '角色', enum: UserRole, example: UserRole.CHILD, required: false })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
