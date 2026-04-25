import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { PlanRecord, RecordStatus } from '../../entities/plan-record.entity';
import { StudyPlan } from '../../entities/study-plan.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(PlanRecord)
    private readonly recordRepository: Repository<PlanRecord>,
    @InjectRepository(StudyPlan)
    private readonly planRepository: Repository<StudyPlan>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 获取概览统计
  async getOverview(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: [
        'totalStudySeconds',
        'totalCompletedPlans',
        'continuousDays',
        'maxContinuousDays',
        'starBalance',
        'totalEarnedStars',
      ],
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 获取今日数据
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayRecords = await this.recordRepository.find({
      where: {
        userId,
        scheduledDate: today,
      },
    });

    const todayCompleted = todayRecords.filter(
      (r) => r.status === RecordStatus.COMPLETED,
    ).length;

    // 获取本周数据
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);

    const weekRecords = await this.recordRepository.find({
      where: {
        userId,
        scheduledDate: Between(weekStart, today),
      },
    });

    const weekCompleted = weekRecords.filter(
      (r) => r.status === RecordStatus.COMPLETED,
    ).length;
    const weekTotal = weekRecords.length;

    // 获取本月数据
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const monthRecords = await this.recordRepository.find({
      where: {
        userId,
        scheduledDate: Between(monthStart, today),
      },
    });

    const monthCompleted = monthRecords.filter(
      (r) => r.status === RecordStatus.COMPLETED,
    ).length;
    const monthTotal = monthRecords.length;

    return {
      // 累计数据
      totalStudyHours: Math.floor(user.totalStudySeconds / 3600),
      totalStudyMinutes: Math.floor((user.totalStudySeconds % 3600) / 60),
      totalCompletedPlans: user.totalCompletedPlans,
      continuousDays: user.continuousDays,
      maxContinuousDays: user.maxContinuousDays,
      totalEarnedStars: user.totalEarnedStars,
      currentStars: user.starBalance,

      // 今日数据
      todayTotal: todayRecords.length,
      todayCompleted,
      todayCompletionRate: todayRecords.length
        ? Math.round((todayCompleted / todayRecords.length) * 100)
        : 0,

      // 本周数据
      weekTotal,
      weekCompleted,
      weekCompletionRate: weekTotal
        ? Math.round((weekCompleted / weekTotal) * 100)
        : 0,

      // 本月数据
      monthTotal,
      monthCompleted,
      monthCompletionRate: monthTotal
        ? Math.round((monthCompleted / monthTotal) * 100)
        : 0,
    };
  }

  // 获取完成率趋势（最近7天）
  async getCompletionTrend(userId: string, days: number = 7) {
    const result = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const records = await this.recordRepository.find({
        where: {
          userId,
          scheduledDate: date,
        },
      });

      const total = records.length;
      const completed = records.filter(
        (r) => r.status === RecordStatus.COMPLETED,
      ).length;

      result.push({
        date: date.toISOString().split('T')[0],
        total,
        completed,
        completionRate: total ? Math.round((completed / total) * 100) : 0,
      });
    }

    return result;
  }

  // 获取科目分布统计
  async getCategoryDistribution(userId: string) {
    const plans = await this.planRepository.find({
      where: { userId },
    });

    const distribution: Record<string, { count: number; completed: number }> =
      {};

    for (const plan of plans) {
      if (!distribution[plan.category]) {
        distribution[plan.category] = { count: 0, completed: 0 };
      }
      distribution[plan.category].count++;
      distribution[plan.category].completed += plan.totalCompleted;
    }

    return Object.entries(distribution).map(([category, data]) => ({
      category,
      ...data,
    }));
  }

  // 获取学习时长统计（最近7天）
  async getStudyDurationTrend(userId: string, days: number = 7) {
    const result = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const records = await this.recordRepository.find({
        where: {
          userId,
          checkInTime: Between(date, nextDate),
        },
      });

      const totalSeconds = records.reduce(
        (sum, r) => sum + (r.actualDuration || 0),
        0,
      );

      result.push({
        date: date.toISOString().split('T')[0],
        durationMinutes: Math.floor(totalSeconds / 60),
        taskCount: records.length,
      });
    }

    return result;
  }

  // 获取详细统计报告
  async getDetailedReport(userId: string, startDate: string, endDate: string) {
    const records = await this.recordRepository.find({
      where: {
        userId,
        scheduledDate: Between(new Date(startDate), new Date(endDate)),
      },
      relations: ['plan'],
      order: { scheduledDate: 'DESC' },
    });

    const totalTasks = records.length;
    const completedTasks = records.filter(
      (r) => r.status === RecordStatus.COMPLETED,
    ).length;
    const missedTasks = records.filter(
      (r) => r.status === RecordStatus.MISSED,
    ).length;

    const totalDuration = records.reduce(
      (sum, r) => sum + (r.actualDuration || 0),
      0,
    );

    const earnedStars = records.reduce((sum, r) => sum + r.earnedStars, 0);

    // 按科目统计
    const categoryStats: Record<string, any> = {};
    for (const record of records) {
      const category = record.plan?.category || 'other';
      if (!categoryStats[category]) {
        categoryStats[category] = {
          category,
          total: 0,
          completed: 0,
          duration: 0,
        };
      }
      categoryStats[category].total++;
      if (record.status === RecordStatus.COMPLETED) {
        categoryStats[category].completed++;
      }
      categoryStats[category].duration += record.actualDuration || 0;
    }

    return {
      period: { startDate, endDate },
      summary: {
        totalTasks,
        completedTasks,
        missedTasks,
        completionRate: totalTasks
          ? Math.round((completedTasks / totalTasks) * 100)
          : 0,
        totalDuration: Math.floor(totalDuration / 60), // 分钟
        earnedStars,
      },
      categoryStats: Object.values(categoryStats),
      records: records.map((r) => ({
        date: r.scheduledDate,
        title: r.plan?.title,
        category: r.plan?.category,
        status: r.status,
        duration: r.actualDuration
          ? Math.floor(r.actualDuration / 60)
          : 0,
        earnedStars: r.earnedStars,
      })),
    };
  }
}
