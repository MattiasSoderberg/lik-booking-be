import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { CreateEventDto } from '../dto/create-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DateBlockedValidationPipe implements PipeTransform {
  constructor(private readonly prisma: PrismaService) {}

  async transform(body: CreateEventDto, metadata: ArgumentMetadata) {
    const startAt = new Date(body.startAt);
    const endAt = new Date(body.endAt);
    const year = startAt.getFullYear();
    const yearStartAt = new Date(`${year}-01-01`);
    const yearEndAt = new Date(`${year}-12-31`);
    const blockingEvent = await this.prisma.event.findFirst({
      where: {
        isBlocking: true,
        startAt: {
          lte: startAt,
          gte: yearStartAt,
        },
        endAt: {
          lte: yearEndAt,
          gte: endAt,
        },
      },
    });

    if (blockingEvent) {
      throw new BadRequestException('Date is blocked for booking');
    }

    console.log('DATE OVERLAP PIPE', blockingEvent);
    startAt.setDate(startAt.getDate() + 1);
    console.log('DATE OVERLAP PIPE AFTER', startAt, yearEndAt);

    // if (existingSemester) {
    //   if (
    //     (startAt >= existingSemester.startAt &&
    //       startAt <= existingSemester.endAt) ||
    //     (endAt >= existingSemester.startAt && endAt <= existingSemester.endAt)
    //   ) {
    //     throw new BadRequestException(
    //       'Semester start date and end date must not overlap.',
    //     );
    //   }
    // }

    return body;
  }
}
