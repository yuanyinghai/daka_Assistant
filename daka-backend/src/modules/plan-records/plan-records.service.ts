import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { PlanRecord, RecordStatus } from '../../entities/plan-record.entity';
import { StudyPlan } from '../../entities/study-plan.entity';
import { User } from '../../entities/user.entity';
import { CheckInDto, ReviewDto } from './dto';

@Injectable()
export class PlanRecordsService {
  constructor(
    @InjectRepository(PlanRecord)
    private readonly recordRepository: Repository<PlanRecord>,
    @InjectRepository(StudyPlan)
    private readonly planRepository: Repository<StudyPlan>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 打卡
  async checkIn(recordId: string, userId: string, checkInDto: CheckInDto) {
    const record = await this.recordRepository.findOne({
      where: { id: recordId },
      relations: ['plan'],
    });

    if (!record) {
      throw new NotFoundException('计划记录不存在');
    }

    if (record.userId !== userId) {
      throw new ForbiddenException('无权操作此记录');
    }

    if (record.status === RecordStatus.COMPLETED) {
      throw new ForbiddenException('今日已打卡，请勿重复打卡');
    }

    const plan = record.plan;

    // 更新记录状态
    const updateData: Partial<PlanRecord> = {
      checkInTime: new Date(),
      status: plan.needReview ? RecordStatus.REVIEWING : RecordStatus.COMPLETED,
      earnedStars: plan.needReview ? 0 : plan.rewardStars,
    };

    if (checkInDto.note) {
      updateData.note = checkInDto.note;
    }
    if (checkInDto.actualDuration) {
      updateData.actualDuration = checkInDto.actualDuration * 60; // 转为秒
    }
    if (checkInDto.attachments) {
      updateData.attachments = checkInDto.attachments;
    }

    await this.recordRepository.update(recordId, updateData);

    // 如果不需要审核，直接发放奖励
    if (!plan.needReview) {
      await this.awardStars(userId, plan.rewardStars);
      await this.updateUserStats(userId, checkInDto.actualDuration || 0);
      await this.updatePlanStats(plan.id);
    }

    return this.recordRepository.findOne({ where: { id: recordId }, relations: ['plan'] });
  }

  // 家长审核
  async review(recordId: string, reviewerId: string, reviewDto: ReviewDto) {
    const record = await this.recordRepository.findOne({
      where: { id: recordId },
      relations: ['plan'],
    });

    if (!record) {
      throw new NotFoundException('计划记录不存在');
    }

    if (record.status !== RecordStatus.REVIEWING) {
      throw new ForbiddenException('该记录不需要审核');
    }

    const plan = record.plan;

    if (reviewDto.approved) {
      // 审核通过，发放奖励
      await this.recordRepository.update(recordId, {
        status: RecordStatus.COMPLETED,
        earnedStars: plan.rewardStars,
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
        reviewNote: reviewDto.note,
      });

      await this.awardStars(record.userId, plan.rewardStars);
      await this.updateUserStats(record.userId, record.actualDuration || 0);
      await this.updatePlanStats(plan.id);
    } else {
      // 审核不通过
      await this.recordRepository.update(recordId, {
        status: RecordStatus.PENDING,
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
        reviewNote: reviewDto.note,
      });
    }

    return this.recordRepository.findOne({ where: { id: recordId }, relations: ['plan'] });
  }

  // 获取用户的打卡记录
  async getUserRecords(userId: string, startDate?: string, endDate?: string) {
    const where: any = { userId };

    if (startDate && endDate) {
      where.scheduledDate = Between(new Date(startDate), new Date(endDate));
    }

    return this.recordRepository.find({
      where,
      relations: ['plan'],
      order: { scheduledDate: 'DESC' },
    });
  }

  // 获取需要审核的记录（家长用）
  async getPendingReviews(parentId: string) {
    // 获取家长所在家庭的成员
    // 这里简化处理，实际应该查询家庭关系
    return this.recordRepository.find({
      where: { status: RecordStatus.REVIEWING },
      relations: ['plan', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  // 发放星星奖励
  private async awardStars(userId: string, stars: number) {
    await this.userRepository.increment({ id: userId }, 'starBalance', stars);
    await this.userRepository.increment({ id: userId }, 'totalEarnedStars', stars);
  }

  // 更新用户统计
  private async updateUserStats(userId: string, durationMinutes: number) {
    const durationSeconds = durationMinutes * 60;
    await this.userRepository.increment({ id: userId }, 'totalStudySeconds', durationSeconds);
    await this.userRepository.increment({ id: userId }, 'totalCompletedPlans', 1);
    
    // 更新连续打卡天数
    await this.updateContinuousDays(userId);
  }

  // 更新连续打卡天数
  private async updateContinuousDays(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastCheckin = user.lastCheckinDate;
    
    if (!lastCheckin) {
      // 首次打卡
      await this.userRepository.update(userId, {
        continuousDays: 1,
        lastCheckinDate: today,
        maxContinuousDays: 1,
      });
    } else {
      const lastDate = new Date(lastCheckin);
      lastDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // 连续打卡
        const newContinuousDays = user.continuousDays + 1;
        await this.userRepository.update(userId, {
          continuousDays: newContinuousDays,
          lastCheckinDate: today,
          maxContinuousDays: Math.max(newContinuousDays, user.maxContinuousDays),
        });
      } else if (diffDays > 1) {
        // 断签，重新计算
        await this.userRepository.update(userId, {
          continuousDays: 1,
          lastCheckinDate: today,
        });
      }
      // diffDays === 0 表示今天已经打过卡，不处理
    }
  }

  // 更新计划统计
  private async updatePlanStats(planId: string) {
    await this.planRepository.increment({ id: planId }, 'totalCheckIns', 1);
    await this.planRepository.increment({ id: planId }, 'totalCompleted', 1);
  }
}
