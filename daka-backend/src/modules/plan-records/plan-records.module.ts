import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanRecordsService } from './plan-records.service';
import { PlanRecordsController } from './plan-records.controller';
import { PlanRecord } from '../../entities/plan-record.entity';
import { StudyPlan } from '../../entities/study-plan.entity';
import { User } from '../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlanRecord, StudyPlan, User])],
  controllers: [PlanRecordsController],
  providers: [PlanRecordsService],
  exports: [PlanRecordsService],
})
export class PlanRecordsModule {}
