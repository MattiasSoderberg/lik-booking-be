import { PartialType } from '@nestjs/swagger';
import { CreateScheduleShiftDto } from './create-schedule-shift.dto';

export class UpdateScheduleShiftDto extends PartialType(
  CreateScheduleShiftDto,
) {}
