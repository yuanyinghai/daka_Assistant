import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StudyPlan } from './study-plan.entity';
import { User } from './user.entity';

export enum RecordStatus {
  PENDING = 'pending',      // 待完成
  COMPLETED = 'completed',  // 已完成
  MISSED = 'missed',        // 未完成
  REVIEWING = 'reviewing',  // 审核中
}

@Entity('plan_records')
export class PlanRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  planId: string;

  @ManyToOne(() => StudyPlan, (plan) => plan.records)
  @JoinColumn({ name: 'planId' })
  plan: StudyPlan;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.planRecords)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'date' })
  scheduledDate: Date;

  @Column({
    type: 'enum',
    enum: RecordStatus,
    default: RecordStatus.PENDING,
  })
  status: RecordStatus;

  @Column({ type: 'timestamp', nullable: true })
  checkInTime: Date;

  @Column({ type: 'int', nullable: true })
  actualDuration: number; // 实际学习时长（秒）

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ type: 'simple-json', nullable: true })
  attachments: string[]; // 图片或文件URL

  @Column({ type: 'uuid', nullable: true })
  reviewedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  reviewedAt: Date;

  @Column({ type: 'text', nullable: true })
  reviewNote: string;

  @Column({ type: 'int', default: 0 })
  earnedStars: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
