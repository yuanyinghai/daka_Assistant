import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { StudyPlan, PlanStatus } from '../../entities/study-plan.entity';
import { PlanRecord, RecordStatus } from '../../entities/plan-record.entity';
import { CreatePlanDto, UpdatePlanDto } from './dto';

@Injectable()
export class StudyPlansService {
  constructor(
    @InjectRepository(StudyPlan)
    private readonly planRepository: Repository<StudyPlan>,
    @InjectRepository(PlanRecord)
    private readonly recordRepository: Repository<PlanRecord>,
  ) {}

  // 创建学习计划
  async create(userId: string, createPlanDto: CreatePlanDto) {
    const plan = this.planRepository.create({
      ...createPlanDto,
      userId,
    });

    await this.planRepository.save(plan);

    // 生成今天的计划记录
    await this.generateTodayRecord(plan);

    return this.findOne(plan.id);
  }

  // 获取用户的所有计划
  async findAll(userId: string) {
    return this.planRepository.find({
      where: { userId, status: PlanStatus.ACTIVE },
      order: { createdAt: 'DESC' },
    });
  }

  // 获取单个计划详情
  async findOne(id: string) {
    const plan = await this.planRepository.findOne({
      where: { id },
      relations: ['records'],
    });

    if (!plan) {
      throw new NotFoundException('学习计划不存在');
    }

    return plan;
  }

  // 更新计划
  async update(id: string, userId: string, updatePlanDto: UpdatePlanDto) {
    const plan = await this.planRepository.findOne({
      where: { id, userId },
    });

    if (!plan) {
      throw new NotFoundException('学习计划不存在');
    }

    await this.planRepository.update(id, updatePlanDto);
    return this.findOne(id);
  }

  // 删除计划（软删除，改为暂停状态）
  async remove(id: string, userId: string) {
    const plan = await this.planRepository.findOne({
      where: { id, userId },
    });

    if (!plan) {
      throw new NotFoundException('学习计划不存在');
    }

    await this.planRepository.update(id, { status: PlanStatus.PAUSED });
    return { message: '计划已暂停' };
  }

  // 获取今日计划列表
  async getTodayPlans(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 获取用户的所有活跃计划
    const plans = await this.planRepository.find({
      where: { userId, status: PlanStatus.ACTIVE },
    });

    // 为每个计划获取或创建今日记录
    const todayPlans = [];
    for (const plan of plans) {
      let record = await this.recordRepository.findOne({
        where: {
          planId: plan.id,
          scheduledDate: today,
        },
      });

      // 如果没有记录，创建一个
      if (!record) {
        record = await this.generateTodayRecord(plan);
      }

      todayPlans.push({
        ...plan,
        recordStatus: record.status,
        recordId: record.id,
      });
    }

    return todayPlans;
  }

  // 生成今日计划记录
  private async generateTodayRecord(plan: StudyPlan) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 检查今天是否需要创建记录（根据重复规则）
    const shouldCreate = this.shouldCreateRecord(plan, today);
    
    if (!shouldCreate) {
      return null;
    }

    const record = this.recordRepository.create({
      planId: plan.id,
      userId: plan.userId,
      scheduledDate: today,
      status: RecordStatus.PENDING,
    });

    return this.recordRepository.save(record);
  }

  // 判断是否应该创建记录
  private shouldCreateRecord(plan: StudyPlan, date: Date): boolean {
    // 检查日期范围
    if (plan.startDate && date < plan.startDate) return false;
    if (plan.endDate && date > plan.endDate) return false;

    const dayOfWeek = date.getDay() || 7; // 1-7，1是周一

    switch (plan.repeatType) {
      case 'daily':
        return true;
      case 'workday':
        return dayOfWeek <= 5;
      case 'weekly':
        if (plan.repeatDays && plan.repeatDays.length > 0) {
          return plan.repeatDays.includes(dayOfWeek);
        }
        return true;
      case 'none':
      default:
        // 只创建一次，检查是否已有记录
        return true;
    }
  }
}
