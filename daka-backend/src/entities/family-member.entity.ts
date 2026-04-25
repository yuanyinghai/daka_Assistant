import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Family } from './family.entity';

export enum FamilyRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
}

@Entity('family_members')
@Unique(['familyId', 'userId'])
export class FamilyMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'family_id' })
  familyId: string;

  @ManyToOne(() => Family, (family) => family.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'family_id' })
  family: Family;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.familyMembers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: FamilyRole,
    default: FamilyRole.MEMBER,
  })
  role: FamilyRole;

  @CreateDateColumn({ name: 'joined_at' })
  joinedAt: Date;
}
