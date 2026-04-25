import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { User } from '../../entities/user.entity';
import { PlanRecord } from '../../entities/plan-record.entity';
import { StudyPlan } from '../../entities/study-plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, PlanRecord, StudyPlan])],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
