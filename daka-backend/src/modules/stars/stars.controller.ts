import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StarsService } from './stars.service';
import { RedeemStarsDto } from './dto';
import { StarRecordType } from '../../entities/star-record.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('星星积分')
@ApiBearerAuth()
@Controller('stars')
@UseGuards(JwtAuthGuard)
export class StarsController {
  constructor(private readonly starsService: StarsService) {}

  @Get('records')
  @ApiOperation({ summary: '获取积分明细' })
  getRecords(
    @Request() req,
    @Query('type') type?: StarRecordType,
  ) {
    return this.starsService.getRecords(req.user.userId, type);
  }

  @Get('statistics')
  @ApiOperation({ summary: '获取积分统计' })
  getStatistics(@Request() req) {
    return this.starsService.getStatistics(req.user.userId);
  }

  @Post('redeem')
  @ApiOperation({ summary: '兑换星星' })
  redeemStars(@Request() req, @Body() redeemDto: RedeemStarsDto) {
    return this.starsService.redeemStars(req.user.userId, redeemDto);
  }
}
