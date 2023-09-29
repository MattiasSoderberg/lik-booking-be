import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { CreateSemesterDto } from '../dto/create-semester.dto';

@Injectable()
export class DatePeriodValidationPipe implements PipeTransform {
  transform(body: CreateSemesterDto, metadata: ArgumentMetadata) {
    const startAt = new Date(body.startAt);
    const endAt = new Date(body.endAt);
    const startYear = startAt.getFullYear();
    const endYear = endAt.getFullYear();
    const allowedPeriodStartAt = new Date(
      body.period === 'SPRING' ? `${startYear}-01-01` : `${startYear}-07-01`,
    );
    const allowedPeriodEndAt = new Date(
      body.period === 'SPRING' ? `${startYear}-06-30` : `${startYear}-12-31`,
    );

    if (startYear !== endYear) {
      throw new BadRequestException(
        'Semester must start and end in the same year.',
      );
    }

    if (
      startAt <= allowedPeriodStartAt ||
      startAt >= allowedPeriodEndAt ||
      endAt <= allowedPeriodStartAt ||
      endAt >= allowedPeriodEndAt
    ) {
      throw new BadRequestException(
        `Semester must be in the ${
          body.period
        } period range. (${allowedPeriodStartAt.toLocaleDateString(
          'se',
        )} - ${allowedPeriodEndAt.toLocaleDateString('se')})`,
      );
    }
    return body;
  }
}
