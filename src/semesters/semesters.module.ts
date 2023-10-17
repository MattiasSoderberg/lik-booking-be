import { Module } from '@nestjs/common';
import { SemestersService } from './semesters.service';
import {
  ScheduleShiftTasksController,
  ScheduleShiftsController,
  SchedulesController,
  SemestersController,
} from './semesters.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EventsModule } from 'src/events/events.module';
import { SchedulesService } from './schedules.service';
import { ScheduleShiftsService } from './schedule-shifts.service';
import { ScheduleShiftTasksService } from './schedule-shift-tasks.service';

@Module({
  controllers: [
    SemestersController,
    SchedulesController,
    ScheduleShiftsController,
    ScheduleShiftTasksController,
  ],
  providers: [
    SemestersService,
    SchedulesService,
    ScheduleShiftsService,
    ScheduleShiftTasksService,
  ],
  imports: [PrismaModule, EventsModule],
})
export class SemestersModule {}
