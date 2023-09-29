import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { CreateSemesterDto } from '../dto/create-semester.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DateOverlapValidationPipe implements PipeTransform {
  constructor(private readonly prisma: PrismaService) {}

  async transform(body: CreateSemesterDto, metadata: ArgumentMetadata) {
    const startAt = new Date(body.startAt);
    const endAt = new Date(body.endAt);
    const year = startAt.getFullYear();
    const existingSemester = await this.prisma.semester.findFirst({
      where: { year },
    });

    if (existingSemester) {
      if (
        (startAt >= existingSemester.startAt &&
          startAt <= existingSemester.endAt) ||
        (endAt >= existingSemester.startAt && endAt <= existingSemester.endAt)
      ) {
        throw new BadRequestException(
          'Semester start date and end date must not overlap.',
        );
      }
    }

    return body;
  }
}
