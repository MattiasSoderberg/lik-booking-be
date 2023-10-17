import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class DateStartEndValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const startAt = new Date(value.startAt);
    const endAt = new Date(value.endAt);

    if (startAt > endAt) {
      throw new BadRequestException('Start date must start before end date');
    }

    return value;
  }
}
