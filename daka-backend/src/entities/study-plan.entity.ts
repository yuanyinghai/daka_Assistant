import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { PlanRecord } from './plan-record.entity';
import { User } from './user.entity';

export enum PlanCategory {
  CHINESE = 'chinese',
  MATH = 'math',
  ENGLISH = 'english',
  SCIENCE = 'science',
  ART = 'art',
  MUSIC = 'music',
  SPORTS = 'sports',
  READING = 'reading',
  OTHER = 'other',
}

export enum PlanStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  PAUSED = 'paused',
}

export enum RepeatType {
  NONE = 'none',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  WORKDAY = 'workday',
}

@Entity('study_plans')
export class StudyPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.studyPlans)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ length: 200 })
  title: string;

  @Column({
    type: 'enum',
    enum: PlanCategory,
    default: PlanCategory.OTHER,
  })
  category: PlanCategory;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({ type: 'int', default: 3 })
  rewardStars: number;

  @Column({ type: 'int', default: 0 })
  penaltyStars: number;

  @Column({ default: false })
  needReview: boolean;

  @Column({
    type: 'enum',
    enum: RepeatType,
    default: RepeatType.NONE,
  })
  repeatType: RepeatType;

  @Column({ type: 'simple-json', nullable: true })
  repeatDays: number[]; // [1,3,5] 表示周一、三、五

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: PlanStatus,
    default: PlanStatus.ACTIVE,
  })
  status: PlanStatus;

  @Column({ type: 'int', default: 0 })
  totalCheckIns: number;

  @Column({ type: 'int', default: 0 })
  totalCompleted: number;

  @OneToMany(() => PlanRecord, (record) => record.plan)
  records: PlanRecord[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
