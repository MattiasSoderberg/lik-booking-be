import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { CreateScheduleShiftDto } from '../dto/create-schedule-shift.dto';

@Injectable()
export class ScheduleShiftValidationPipe implements PipeTransform {
  transform(body: CreateScheduleShiftDto, metadata: ArgumentMetadata) {
    const startAt = new Date(body.startAt);
    const endAt = new Date(body.endAt);
    const dateStartAt = new Date(body.startAt);
    const dateEndAt = new Date(body.startAt);
    dateStartAt.setUTCHours(0, 0, 0, 0);
    dateEndAt.setUTCHours(23, 59, 59, 999);

    if (startAt < dateStartAt || endAt > dateEndAt) {
      throw new BadRequestException(
        'A shift must start and end within same date',
      );
    }

    return body;
  }
}
