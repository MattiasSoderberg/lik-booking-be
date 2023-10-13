import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { CreateScheduleDto } from '../dto/create-schedule.dto';

@Injectable()
export class ScheduleValidationPipe implements PipeTransform {
  transform(body: CreateScheduleDto, metadata: ArgumentMetadata) {
    if (body.staff && body.client) {
      throw new BadRequestException(
        'Schedule can only be created for staff OR client.',
      );
    }

    if (body.client && body.semesterPlan === 'STAFF') {
      throw new BadRequestException(
        'Clients semester plan must be FULL or HALF.',
      );
    }

    return body;
  }
}
