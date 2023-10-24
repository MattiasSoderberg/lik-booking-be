import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { CreateEventDto } from '../dto/create-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventValidationPipe implements PipeTransform {
  constructor(private readonly prisma: PrismaService) {}

  async transform(body: CreateEventDto, metadata: ArgumentMetadata) {
    const startAt = new Date(body.startAt);
    const endAt = new Date(body.endAt);
    const year = startAt.getFullYear();
    const yearStartAt = new Date(`${year}-01-01`);
    const yearEndAt = new Date(`${year}-12-31`);
    const blockingEvent = await this.prisma.event.findFirst({
      where: {
        startAt: {
          gte: yearStartAt,
        },
        endAt: {
          lte: yearEndAt,
        },
        AND: [
          {
            OR: [
              { isBlocking: true },
              { assetId: body?.asset?.uuid },
              { staffId: body?.staff?.uuid },
              { clientId: body?.client?.uuid },
            ],
          },
          {
            OR: [
              {
                startAt: {
                  lte: startAt,
                },
                endAt: {
                  gte: endAt,
                },
              },
              {
                startAt: {
                  lte: startAt,
                },
                endAt: {
                  lte: endAt,
                  gte: startAt,
                },
              },
              {
                startAt: {
                  gte: startAt,
                  lte: endAt,
                },
                endAt: {
                  gte: endAt,
                },
              },
            ],
          },
        ],
      },
    });

    if (blockingEvent) {
      throw new BadRequestException('Date is not available');
    }

    return body;
  }
}
