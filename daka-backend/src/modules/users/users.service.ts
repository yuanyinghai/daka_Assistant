import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { UpdateProfileDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 获取用户资料
  async findById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return this.sanitizeUser(user);
  }

  // 更新用户资料
  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const { nickname, avatarUrl } = updateProfileDto;

    await this.userRepository.update(userId, {
      nickname,
      avatarUrl,
    });

    return this.findById(userId);
  }

  // 获取用户统计
  async getStatistics(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return {
      totalStudySeconds: user.totalStudySeconds,
      totalCompletedPlans: user.totalCompletedPlans,
      continuousDays: user.continuousDays,
      maxContinuousDays: user.maxContinuousDays,
      starBalance: user.starBalance,
      totalEarnedStars: user.totalEarnedStars,
      totalSpentStars: user.totalSpentStars,
    };
  }

  // 过滤敏感信息
  private sanitizeUser(user: User) {
    const { passwordHash, ...sanitized } = user as any;
    return sanitized;
  }
}
