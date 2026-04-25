import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PlanRecordsService } from './plan-records.service';
import { CheckInDto, ReviewDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('打卡记录')
@ApiBearerAuth()
@Controller('plan-records')
@UseGuards(JwtAuthGuard)
export class PlanRecordsController {
  constructor(private readonly planRecordsService: PlanRecordsService) {}

  @Post(':id/check-in')
  @ApiOperation({ summary: '打卡' })
  checkIn(
    @Request() req,
    @Param('id') recordId: string,
    @Body() checkInDto: CheckInDto,
  ) {
    return this.planRecordsService.checkIn(recordId, req.user.userId, checkInDto);
  }

  @Post(':id/review')
  @ApiOperation({ summary: '审核打卡（家长）' })
  review(
    @Request() req,
    @Param('id') recordId: string,
    @Body() reviewDto: ReviewDto,
  ) {
    return this.planRecordsService.review(recordId, req.user.userId, reviewDto);
  }

  @Get('my-records')
  @ApiOperation({ summary: '获取我的打卡记录' })
  getMyRecords(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.planRecordsService.getUserRecords(req.user.userId, startDate, endDate);
  }

  @Get('pending-reviews')
  @ApiOperation({ summary: '获取待审核记录（家长）' })
  getPendingReviews(@Request() req) {
    return this.planRecordsService.getPendingReviews(req.user.userId);
  }
}
