import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { PlanCategory, RepeatType } from '../../../entities/study-plan.entity';

export class CreatePlanDto {
  @ApiProperty({ description: '计划标题', example: '数学作业' })
  @IsString()
  title: string;

  @ApiProperty({
    description: '科目分类',
    enum: PlanCategory,
    example: PlanCategory.MATH,
  })
  @IsEnum(PlanCategory)
  category: PlanCategory;

  @ApiProperty({ description: '计划描述', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: '开始时间', example: '16:00' })
  @IsString()
  startTime: string;

  @ApiProperty({ description: '结束时间', example: '17:00' })
  @IsString()
  endTime: string;

  @ApiProperty({ description: '奖励星星数', example: 5, minimum: 1, maximum: 20 })
  @IsInt()
  @Min(1)
  @Max(20)
  rewardStars: number;

  @ApiProperty({ description: '未完成扣除星星数', example: 0, minimum: 0, maximum: 10 })
  @IsInt()
  @Min(0)
  @Max(10)
  @IsOptional()
  penaltyStars?: number;

  @ApiProperty({ description: '是否需要家长审核', example: false })
  @IsBoolean()
  @IsOptional()
  needReview?: boolean;

  @ApiProperty({
    description: '重复类型',
    enum: RepeatType,
    example: RepeatType.DAILY,
  })
  @IsEnum(RepeatType)
  @IsOptional()
  repeatType?: RepeatType;

  @ApiProperty({ description: '重复日期 [1,3,5] 表示周一、三、五', required: false })
  @IsOptional()
  repeatDays?: number[];

  @ApiProperty({ description: '开始日期', required: false })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ description: '结束日期', required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;
}
