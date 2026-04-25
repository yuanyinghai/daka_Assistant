import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FamiliesService } from './families.service';
import { CreateFamilyDto, JoinFamilyDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('家庭')
@ApiBearerAuth()
@Controller('families')
@UseGuards(JwtAuthGuard)
export class FamiliesController {
  constructor(private readonly familiesService: FamiliesService) {}

  @Post()
  @ApiOperation({ summary: '创建家庭' })
  create(@Request() req, @Body() createFamilyDto: CreateFamilyDto) {
    return this.familiesService.create(req.user.userId, createFamilyDto);
  }

  @Get('my')
  @ApiOperation({ summary: '获取我的家庭列表' })
  findMyFamilies(@Request() req) {
    return this.familiesService.findByUser(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取家庭详情' })
  findOne(@Param('id') id: string) {
    return this.familiesService.findOne(id);
  }

  @Get(':id/children')
  @ApiOperation({ summary: '获取家庭的孩子列表' })
  findChildren(@Param('id') id: string) {
    return this.familiesService.findChildren(id);
  }

  @Post('join')
  @ApiOperation({ summary: '加入家庭' })
  join(@Request() req, @Body() joinFamilyDto: JoinFamilyDto) {
    return this.familiesService.join(req.user.userId, joinFamilyDto);
  }
}
