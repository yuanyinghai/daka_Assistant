import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum StarRecordType {
  EARN = 'earn',
  SPEND = 'spend',
}

@Entity('star_records')
export class StarRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.starRecords, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  amount: number;

  @Column({
    type: 'enum',
    enum: StarRecordType,
  })
  type: StarRecordType;

  @Column({ length: 50 })
  source: string;

  @Column({ name: 'source_id', nullable: true })
  sourceId: string;

  @Column({ length: 200, nullable: true })
  description: string;

  @Column({ name: 'balance_after' })
  balanceAfter: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
