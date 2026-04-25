import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { User } from '../../entities/user.entity';
import { PlanRecord, RecordStatus } from '../../entities/plan-record.entity';
import { StudyPlan } from '../../entities/study-plan.entity';

export interface LearningAdvice {
  type: 'strength' | 'weakness' | 'suggestion' | 'encouragement';
  title: string;
  content: string;
  action?: string;
}

export interface WeeklyReport {
  period: { start: string; end: string };
  summary: {
    totalTasks: number;
    completedTasks: number;
    completionRate: number;
    totalStudyMinutes: number;
    earnedStars: number;
  };
  highlights: string[];
  improvements: string[];
  nextWeekGoals: string[];
  aiInsights: string;
}

@Injectable()
export class AiService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PlanRecord)
    private readonly recordRepository: Repository<PlanRecord>,
    @InjectRepository(StudyPlan)
    private readonly planRepository: Repository<StudyPlan>,
  ) {}

  // 获取个性化学习建议
  async getLearningAdvice(userId: string): Promise<LearningAdvice[]> {
    const advice: LearningAdvice[] = [];

    // 获取最近7天的数据
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    const records = await this.recordRepository.find({
      where: {
        userId,
        scheduledDate: Between(startDate, endDate),
      },
      relations: ['plan'],
    });

    const user = await this.userRepository.findOne({ where: { id: userId } });

    // 分析完成率
    const completedCount = records.filter(r => r.status === RecordStatus.COMPLETED).length;
    const totalCount = records.length;
    const completionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    // 强项分析
    if (completionRate >= 80) {
      advice.push({
        type: 'strength',
        title: '🌟 学习表现优秀',
        content: `本周完成率达到 ${completionRate.toFixed(0)}%，保持了良好的学习习惯！`,
        action: '继续保持，挑战更高目标',
      });
    }

    if (user?.continuousDays >= 7) {
      advice.push({
        type: 'strength',
        title: '🔥 连续打卡达人',
        content: `已连续打卡 ${user.continuousDays} 天，自律性超强！`,
        action: '向最长纪录 ${user.maxContinuousDays} 天发起冲击',
      });
    }

    // 弱点分析
    if (completionRate < 60 && totalCount > 0) {
      advice.push({
        type: 'weakness',
        title: '⚠️ 完成率有待提升',
        content: `本周完成率为 ${completionRate.toFixed(0)}%，有些计划没有完成哦。`,
        action: '建议适当减少任务量，专注完成重要任务',
      });
    }

    // 科目分析
    const categoryStats: Record<string, { total: number; completed: number }> = {};
    for (const record of records) {
      const category = record.plan?.category || 'other';
      if (!categoryStats[category]) {
        categoryStats[category] = { total: 0, completed: 0 };
      }
      categoryStats[category].total++;
      if (record.status === RecordStatus.COMPLETED) {
        categoryStats[category].completed++;
      }
    }

    // 找出薄弱科目
    const weakCategories = Object.entries(categoryStats)
      .filter(([_, stats]) => stats.total > 0 && (stats.completed / stats.total) < 0.6)
      .map(([category]) => category);

    if (weakCategories.length > 0) {
      const categoryNames: Record<string, string> = {
        chinese: '语文', math: '数学', english: '英语',
        science: '科学', art: '艺术', music: '音乐',
        sports: '体育', reading: '阅读', other: '其他'
      };
      advice.push({
        type: 'weakness',
        title: '📚 需要加强的科目',
        content: `${weakCategories.map(c => categoryNames[c] || c).join('、')}的完成率较低，建议多花时间。`,
        action: '制定针对性学习计划',
      });
    }

    // 智能建议
    const avgDuration = records.length > 0
      ? records.reduce((sum, r) => sum + (r.actualDuration || 0), 0) / records.length / 60
      : 0;

    if (avgDuration > 0 && avgDuration < 20) {
      advice.push({
        type: 'suggestion',
        title: '⏱️ 建议延长学习时间',
        content: `平均每次学习 ${avgDuration.toFixed(0)} 分钟，建议逐步延长到 30-45 分钟。`,
        action: '使用番茄工作法，专注学习',
      });
    }

    if (records.length === 0) {
      advice.push({
        type: 'suggestion',
        title: '📝 开始制定计划',
        content: '还没有学习计划，快添加几个小目标开始吧！',
        action: '去计划页添加学习任务',
      });
    }

    // 鼓励语
    const encouragements = [
      { title: '🎯 小步前进', content: '每天进步一点点，积累起来就是巨大的改变！' },
      { title: '💪 相信自己', content: '你有无限的潜力，只要坚持就能达成目标！' },
      { title: '🌈 保持好奇', content: '学习是探索世界的旅程，享受这个过程！' },
      { title: '🏆 奖励自己', content: '完成目标后，别忘了用星星兑换喜欢的奖励！' },
    ];
    
    const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
    advice.push({
      type: 'encouragement',
      ...randomEncouragement,
    });

    return advice;
  }

  // 生成周报
  async generateWeeklyReport(userId: string): Promise<WeeklyReport> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    const records = await this.recordRepository.find({
      where: {
        userId,
        scheduledDate: Between(startDate, endDate),
      },
      relations: ['plan'],
    });

    const user = await this.userRepository.findOne({ where: { id: userId } });

    const totalTasks = records.length;
    const completedTasks = records.filter(r => r.status === RecordStatus.COMPLETED).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const totalStudyMinutes = Math.round(
      records.reduce((sum, r) => sum + (r.actualDuration || 0), 0) / 60
    );
    const earnedStars = records.reduce((sum, r) => sum + r.earnedStars, 0);

    // 生成亮点
    const highlights: string[] = [];
    if (completionRate >= 80) highlights.push(`完成率高达 ${completionRate}%，表现优异！`);
    if (user?.continuousDays >= 7) highlights.push(`连续打卡 ${user.continuousDays} 天，自律性超强！`);
    if (totalStudyMinutes >= 300) highlights.push(`本周学习 ${Math.floor(totalStudyMinutes / 60)} 小时，投入度很高！`);
    if (earnedStars >= 50) highlights.push(`获得 ${earnedStars} 颗星星，收获满满！`);
    if (highlights.length === 0) highlights.push('坚持学习，每天都在进步！');

    // 生成改进点
    const improvements: string[] = [];
    if (completionRate < 60) improvements.push('完成率有待提升，建议合理安排任务量');
    if (totalStudyMinutes < 120) improvements.push('学习时长较短，建议每天增加学习时间');
    if (records.some(r => r.status === RecordStatus.MISSED)) {
      improvements.push('有任务未完成，建议设置提醒避免遗忘');
    }
    if (improvements.length === 0) improvements.push('继续保持，追求完美！');

    // 生成下周目标
    const nextWeekGoals: string[] = [
      `完成率目标：${Math.min(completionRate + 10, 100)}%`,
      `学习时长目标：${Math.max(Math.floor(totalStudyMinutes / 60) + 2, 5)} 小时`,
      '每天按时完成所有计划任务',
      '保持连续打卡记录',
    ];

    // AI 洞察
    let aiInsights = '';
    if (completionRate >= 90) {
      aiInsights = '你的学习状态非常棒！保持这种节奏，你将在学习上取得更大的成就。建议可以适当增加一些有挑战性的任务。';
    } else if (completionRate >= 70) {
      aiInsights = '整体表现不错，但还有提升空间。建议分析一下未完成的任务，找出原因并针对性改进。';
    } else if (completionRate >= 50) {
      aiInsights = '学习进度需要加强。建议重新评估任务难度，从简单的任务开始，逐步建立信心和习惯。';
    } else {
      aiInsights = '看起来这周遇到了一些困难。不要气馁！建议减少任务数量，专注于最重要的几件事，逐步找回学习节奏。';
    }

    return {
      period: {
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0],
      },
      summary: {
        totalTasks,
        completedTasks,
        completionRate,
        totalStudyMinutes,
        earnedStars,
      },
      highlights,
      improvements,
      nextWeekGoals,
      aiInsights,
    };
  }

  // 获取智能提醒
  async getSmartReminders(userId: string) {
    const reminders: Array<{
      type: 'urgent' | 'suggestion' | 'motivation';
      title: string;
      message: string;
      action?: string;
    }> = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 获取今日任务
    const todayRecords = await this.recordRepository.find({
      where: {
        userId,
        scheduledDate: today,
      },
      relations: ['plan'],
    });

    const pendingTasks = todayRecords.filter(r => r.status === RecordStatus.PENDING);
    const completedTasks = todayRecords.filter(r => r.status === RecordStatus.COMPLETED);

    // 紧急提醒
    if (pendingTasks.length > 0) {
      const now = new Date();
      const currentHour = now.getHours();

      // 检查是否有即将到期的任务
      const urgentTasks = pendingTasks.filter(r => {
        const endHour = parseInt(r.plan.endTime.split(':')[0]);
        return endHour - currentHour <= 2 && endHour > currentHour;
      });

      if (urgentTasks.length > 0) {
        reminders.push({
          type: 'urgent',
          title: '⏰ 任务即将到期',
          message: `还有 ${urgentTasks.length} 个任务即将到期，抓紧时间完成！`,
          action: '立即去打卡',
        });
      }
    }

    // 如果还没开始今天的任务
    if (completedTasks.length === 0 && pendingTasks.length > 0) {
      reminders.push({
        type: 'suggestion',
        title: '🌅 开启今天的学习',
        message: `今天有 ${pendingTasks.length} 个任务等你完成，从第一个开始吧！`,
        action: '查看今日计划',
      });
    }

    // 鼓励提醒
    if (completedTasks.length > 0) {
      reminders.push({
        type: 'motivation',
        title: '🎉 今天已完成 ' + completedTasks.length + ' 个任务',
        message: '太棒了！继续保持，完成今天的所有目标！',
        action: '继续加油',
      });
    }

    // 连续打卡提醒
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user?.continuousDays > 0) {
      reminders.push({
        type: 'motivation',
        title: '🔥 连续打卡提醒',
        message: `已连续打卡 ${user.continuousDays} 天，今天也要坚持哦！`,
        action: '保持记录',
      });
    }

    return reminders;
  }

  // 艾宾浩斯记忆曲线提醒
  async getMemoryCurveReminders(userId: string) {
    const now = new Date();
    const reminders: Array<{
      planId: string;
      title: string;
      reviewDate: string;
      daysSince: number;
    }> = [];

    // 获取所有已完成的计划
    const completedRecords = await this.recordRepository.find({
      where: {
        userId,
        status: RecordStatus.COMPLETED,
      },
      relations: ['plan'],
      order: { checkInTime: 'DESC' },
    });

    // 艾宾浩斯复习时间点：1天、2天、4天、7天、15天
    const reviewIntervals = [1, 2, 4, 7, 15];

    for (const record of completedRecords) {
      if (!record.checkInTime) continue;

      const checkInDate = new Date(record.checkInTime);
      const daysSince = Math.floor((now.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

      // 检查是否是复习时间点
      if (reviewIntervals.includes(daysSince)) {
        reminders.push({
          planId: record.planId,
          title: record.plan?.title || '',
          reviewDate: now.toISOString().split('T')[0],
          daysSince,
        });
      }
    }

    return reminders;
  }
}
