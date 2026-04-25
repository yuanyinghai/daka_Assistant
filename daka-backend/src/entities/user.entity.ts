import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { FamilyMember } from './family-member.entity';
import { StarRecord } from './star-record.entity';
import { StudyPlan } from './study-plan.entity';
import { PlanRecord } from './plan-record.entity';

export enum UserRole {
  PARENT = 'parent',
  CHILD = 'child',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 20 })
  phone: string;

  @Column({ name: 'password_hash', length: 255 })
  passwordHash: string;

  @Column({ length: 50 })
  nickname: string;

  @Column({ name: 'avatar_url', length: 500, nullable: true })
  avatarUrl: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CHILD,
  })
  role: UserRole;

  // 积分相关
  @Column({ name: 'star_balance', default: 0 })
  starBalance: number;

  @Column({ name: 'total_earned_stars', default: 0 })
  totalEarnedStars: number;

  @Column({ name: 'total_spent_stars', default: 0 })
  totalSpentStars: number;

  // 学习统计
  @Column({ name: 'total_study_seconds', default: 0 })
  totalStudySeconds: number;

  @Column({ name: 'total_completed_plans', default: 0 })
  totalCompletedPlans: number;

  // 连续打卡
  @Column({ name: 'continuous_days', default: 0 })
  continuousDays: number;

  @Column({ name: 'last_checkin_date', type: 'date', nullable: true })
  lastCheckinDate: Date;

  @Column({ name: 'max_continuous_days', default: 0 })
  maxContinuousDays: number;

  // 关联
  @OneToMany(() => FamilyMember, (member) => member.user)
  familyMembers: FamilyMember[];

  @OneToMany(() => StarRecord, (record) => record.user)
  starRecords: StarRecord[];

  @OneToMany(() => StudyPlan, (plan) => plan.user)
  studyPlans: StudyPlan[];

  @OneToMany(() => PlanRecord, (record) => record.user)
  planRecords: PlanRecord[];

  // 时间戳
  @Column({ name: 'last_login_at', type: 'timestamp', nullable: true })
  lastLoginAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
