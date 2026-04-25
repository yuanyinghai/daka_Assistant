import {
  Controller,
  Get,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('数据统计')
@ApiBearerAuth()
@Controller('statistics')
@UseGuards(JwtAuthGuard)
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('overview')
  @ApiOperation({ summary: '获取概览统计' })
  getOverview(@Request() req) {
    return this.statisticsService.getOverview(req.user.userId);
  }

  @Get('completion-trend')
  @ApiOperation({ summary: '获取完成率趋势' })
  getCompletionTrend(
    @Request() req,
    @Query('days') days?: string,
  ) {
    return this.statisticsService.getCompletionTrend(
      req.user.userId,
      days ? parseInt(days) : 7,
    );
  }

  @Get('category-distribution')
  @ApiOperation({ summary: '获取科目分布' })
  getCategoryDistribution(@Request() req) {
    return this.statisticsService.getCategoryDistribution(req.user.userId);
  }

  @Get('duration-trend')
  @ApiOperation({ summary: '获取学习时长趋势' })
  getDurationTrend(
    @Request() req,
    @Query('days') days?: string,
  ) {
    return this.statisticsService.getStudyDurationTrend(
      req.user.userId,
      days ? parseInt(days) : 7,
    );
  }

  @Get('detailed-report')
  @ApiOperation({ summary: '获取详细报告' })
  getDetailedReport(
    @Request() req,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.statisticsService.getDetailedReport(
      req.user.userId,
      startDate,
      endDate,
    );
  }
}
