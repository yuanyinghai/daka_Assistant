import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min } from 'class-validator';

export class RedeemStarsDto {
  @ApiProperty({ description: '兑换数量', minimum: 1 })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({ description: '兑换项目', example: '30分钟游戏时间' })
  @IsString()
  item: string;

  @ApiProperty({ description: '备注', required: false })
  @IsString()
  note?: string;
}
