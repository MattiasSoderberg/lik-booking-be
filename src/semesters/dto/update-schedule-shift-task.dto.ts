import { PartialType } from '@nestjs/swagger';
import { CreateScheduleShiftTaskDto } from './create-schedule-shift-task.dto';

export class UpdateScheduleShiftTaskDto extends PartialType(
  CreateScheduleShiftTaskDto,
) {}
