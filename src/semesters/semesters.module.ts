import { Module } from '@nestjs/common';
import { SemestersService } from './semesters.service';
import { SemestersController } from './semesters.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EventsModule } from 'src/events/events.module';
import { SchedulesService } from './schedules.service';
import { ScheduleShiftsService } from './schedule-shifts.service';

@Module({
  controllers: [SemestersController],
  providers: [SemestersService, SchedulesService, ScheduleShiftsService],
  imports: [PrismaModule, EventsModule],
})
export class SemestersModule {}
