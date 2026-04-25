import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Family } from '../../entities/family.entity';
import { FamilyMember, FamilyRole } from '../../entities/family-member.entity';
import { User } from '../../entities/user.entity';
import { CreateFamilyDto, JoinFamilyDto } from './dto';

@Injectable()
export class FamiliesService {
  constructor(
    @InjectRepository(Family)
    private readonly familyRepository: Repository<Family>,
    @InjectRepository(FamilyMember)
    private readonly familyMemberRepository: Repository<FamilyMember>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 创建家庭
  async create(userId: string, createFamilyDto: CreateFamilyDto) {
    const { name } = createFamilyDto;

    // 生成邀请码
    const inviteCode = this.generateInviteCode();

    // 创建家庭
    const family = this.familyRepository.create({
      name,
      inviteCode,
      createdById: userId,
    });

    await this.familyRepository.save(family);

    // 创建家庭成员（创建者为owner）
    const member = this.familyMemberRepository.create({
      familyId: family.id,
      userId,
      role: FamilyRole.OWNER,
    });

    await this.familyMemberRepository.save(member);

    return this.findOne(family.id);
  }

  // 查找家庭详情
  async findOne(id: string) {
    const family = await this.familyRepository.findOne({
      where: { id },
      relations: ['members', 'members.user'],
    });

    if (!family) {
      throw new NotFoundException('家庭不存在');
    }

    return family;
  }

  // 通过邀请码查找家庭
  async findByInviteCode(inviteCode: string) {
    return this.familyRepository.findOne({
      where: { inviteCode },
    });
  }

  // 加入家庭
  async join(userId: string, joinFamilyDto: JoinFamilyDto) {
    const { inviteCode } = joinFamilyDto;

    // 查找家庭
    const family = await this.findByInviteCode(inviteCode);

    if (!family) {
      throw new NotFoundException('邀请码无效');
    }

    // 检查是否已是成员
    const existingMember = await this.familyMemberRepository.findOne({
      where: { familyId: family.id, userId },
    });

    if (existingMember) {
      throw new ConflictException('您已是该家庭成员');
    }

    // 创建成员关系
    const member = this.familyMemberRepository.create({
      familyId: family.id,
      userId,
      role: FamilyRole.MEMBER,
    });

    await this.familyMemberRepository.save(member);

    return this.findOne(family.id);
  }

  // 获取用户的家庭列表
  async findByUser(userId: string) {
    const members = await this.familyMemberRepository.find({
      where: { userId },
      relations: ['family', 'family.members', 'family.members.user'],
    });

    return members.map((member) => member.family);
  }

  // 获取家庭的孩子列表
  async findChildren(familyId: string) {
    const members = await this.familyMemberRepository.find({
      where: { familyId },
      relations: ['user'],
    });

    return members
      .filter((member) => member.user.role === 'child')
      .map((member) => member.user);
  }

  // 生成邀请码
  private generateInviteCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}
