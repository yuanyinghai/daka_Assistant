import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('AI 功能')
@ApiBearerAuth()
@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('learning-advice')
  @ApiOperation({ summary: '获取个性化学习建议' })
  getLearningAdvice(@Request() req) {
    return this.aiService.getLearningAdvice(req.user.userId);
  }

  @Get('weekly-report')
  @ApiOperation({ summary: '生成周报' })
  getWeeklyReport(@Request() req) {
    return this.aiService.generateWeeklyReport(req.user.userId);
  }

  @Get('smart-reminders')
  @ApiOperation({ summary: '获取智能提醒' })
  getSmartReminders(@Request() req) {
    return this.aiService.getSmartReminders(req.user.userId);
  }

  @Get('memory-curve')
  @ApiOperation({ summary: '获取艾宾浩斯复习提醒' })
  getMemoryCurveReminders(@Request() req) {
    return this.aiService.getMemoryCurveReminders(req.user.userId);
  }
}
