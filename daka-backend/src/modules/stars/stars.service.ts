import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StarRecord, StarRecordType } from '../../entities/star-record.entity';
import { User } from '../../entities/user.entity';
import { CreateStarRecordDto, RedeemStarsDto } from './dto';

@Injectable()
export class StarsService {
  constructor(
    @InjectRepository(StarRecord)
    private readonly starRecordRepository: Repository<StarRecord>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 创建积分记录（发放或扣除）
  async createRecord(userId: string, createDto: CreateStarRecordDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 计算新余额
    let newBalance: number;
    if (createDto.type === StarRecordType.EARN) {
      newBalance = user.starBalance + createDto.amount;
    } else {
      newBalance = user.starBalance - createDto.amount;
      if (newBalance < 0) {
        throw new BadRequestException('星星余额不足');
      }
    }

    // 创建记录
    const record = this.starRecordRepository.create({
      ...createDto,
      userId,
      balanceAfter: newBalance,
    });

    await this.starRecordRepository.save(record);

    // 更新用户余额
    await this.userRepository.update(userId, {
      starBalance: newBalance,
      ...(createDto.type === StarRecordType.EARN
        ? { totalEarnedStars: () => `total_earned_stars + ${createDto.amount}` }
        : { totalSpentStars: () => `total_spent_stars + ${createDto.amount}` }),
    });

    return record;
  }

  // 兑换星星（消费）
  async redeemStars(userId: string, redeemDto: RedeemStarsDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    if (user.starBalance < redeemDto.amount) {
      throw new BadRequestException('星星余额不足');
    }

    const newBalance = user.starBalance - redeemDto.amount;

    // 创建消费记录
    const record = this.starRecordRepository.create({
      userId,
      amount: redeemDto.amount,
      type: StarRecordType.SPEND,
      source: 'redeem',
      description: `兑换：${redeemDto.item}${redeemDto.note ? ' - ' + redeemDto.note : ''}`,
      balanceAfter: newBalance,
    });

    await this.starRecordRepository.save(record);

    // 更新用户余额
    await this.userRepository.update(userId, {
      starBalance: newBalance,
      totalSpentStars: () => `total_spent_stars + ${redeemDto.amount}`,
    });

    return {
      message: '兑换成功',
      redeemedAmount: redeemDto.amount,
      remainingBalance: newBalance,
    };
  }

  // 获取积分明细
  async getRecords(userId: string, type?: StarRecordType) {
    const where: any = { userId };
    if (type) {
      where.type = type;
    }

    return this.starRecordRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  // 获取积分统计
  async getStatistics(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['starBalance', 'totalEarnedStars', 'totalSpentStars'],
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 获取本周获得星星
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
    weekStart.setHours(0, 0, 0, 0);

    const weekEarned = await this.starRecordRepository
      .createQueryBuilder('record')
      .select('SUM(record.amount)', 'total')
      .where('record.userId = :userId', { userId })
      .andWhere('record.type = :type', { type: StarRecordType.EARN })
      .andWhere('record.createdAt >= :weekStart', { weekStart })
      .getRawOne();

    // 获取今日获得星星
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayEarned = await this.starRecordRepository
      .createQueryBuilder('record')
      .select('SUM(record.amount)', 'total')
      .where('record.userId = :userId', { userId })
      .andWhere('record.type = :type', { type: StarRecordType.EARN })
      .andWhere('record.createdAt >= :today', { today })
      .getRawOne();

    return {
      currentBalance: user.starBalance,
      totalEarned: user.totalEarnedStars,
      totalSpent: user.totalSpentStars,
      weekEarned: parseInt(weekEarned?.total || '0'),
      todayEarned: parseInt(todayEarned?.total || '0'),
    };
  }

  // 批量发放星星（用于计划完成奖励）
  async batchAwardStars(
    userId: string,
    amount: number,
    source: string,
    sourceId: string,
    description: string,
  ) {
    return this.createRecord(userId, {
      userId,
      amount,
      type: StarRecordType.EARN,
      source,
      sourceId,
      description,
    });
  }
}
