import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StudyPlansService } from './study-plans.service';
import { CreatePlanDto, UpdatePlanDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('学习计划')
@ApiBearerAuth()
@Controller('study-plans')
@UseGuards(JwtAuthGuard)
export class StudyPlansController {
  constructor(private readonly studyPlansService: StudyPlansService) {}

  @Post()
  @ApiOperation({ summary: '创建学习计划' })
  create(@Request() req, @Body() createPlanDto: CreatePlanDto) {
    return this.studyPlansService.create(req.user.userId, createPlanDto);
  }

  @Get()
  @ApiOperation({ summary: '获取所有学习计划' })
  findAll(@Request() req) {
    return this.studyPlansService.findAll(req.user.userId);
  }

  @Get('today')
  @ApiOperation({ summary: '获取今日计划' })
  getTodayPlans(@Request() req) {
    return this.studyPlansService.getTodayPlans(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取计划详情' })
  findOne(@Param('id') id: string) {
    return this.studyPlansService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新学习计划' })
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updatePlanDto: UpdatePlanDto,
  ) {
    return this.studyPlansService.update(id, req.user.userId, updatePlanDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '暂停学习计划' })
  remove(@Request() req, @Param('id') id: string) {
    return this.studyPlansService.remove(id, req.user.userId);
  }
}
