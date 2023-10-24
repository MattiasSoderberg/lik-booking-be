import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { CreateEventGroupDto } from './dto/create-event-group.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { AppAbility } from 'src/auth/auth.ability';
import { Action } from 'src/utils/action.enum';
import { accessibleBy } from '@casl/prisma';
import { Prisma, Semester } from '@prisma/client';
import { PrismaErrors } from 'src/utils/prisma-errors.enum';
import { AdminRouteException } from 'src/auth/exceptions/admin-route.exception';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(createEventDto: CreateEventDto, ability: AppAbility, user) {
    // TODO fix user type
    if (!ability.can(Action.Create, 'Event')) {
      throw new ForbiddenException();
    }

    try {
      const { asset, staff, client, ...eventData } = createEventDto;
      const dataToCreate = {
        ...eventData,
        createdBy: {
          connect: { uuid: user.uuid },
        },
      };
      if (asset) {
        const { uuid } = asset;
        dataToCreate['asset'] = {
          connect: { uuid },
        };
      }
      if (staff) {
        const { uuid } = staff;
        dataToCreate['staff'] = {
          connect: { uuid },
        };
      }
      if (client) {
        const { uuid } = client;
        dataToCreate['client'] = {
          connect: { uuid },
        };
      }
      return await this.prisma.event.create({ data: dataToCreate });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error?.code === PrismaErrors.RecordNotFound
      ) {
        throw new BadRequestException('Record not found.');
      }
      throw new BadRequestException(error);
    }
  }

  async findAll(ability: AppAbility) {
    try {
      return await this.prisma.event.findMany({
        where: accessibleBy(ability).Event,
      });
    } catch (error) {
      throw new ForbiddenException();
    }
  }

  async findOne(uuid: string, ability: AppAbility) {
    try {
      return await this.prisma.event.findFirst({
        where: { AND: [accessibleBy(ability).Event, { uuid }] },
      });
    } catch (error) {
      throw new ForbiddenException();
    }
  }

  update(uuid: string, updateEventDto: UpdateEventDto) {
    return `This action updates a #${uuid} event`;
  }

  async remove(uuid: string, ability: AppAbility) {
    if (!ability.can(Action.Delete, 'Event')) {
      throw new ForbiddenException();
    }
    return await this.prisma.event.delete({ where: { uuid } });
  }

  async checkDateAvailability(
    event: CreateEventDto,
    semester: Semester,
  ): Promise<Boolean> {
    const blockingEvent = await this.prisma.event.findFirst({
      where: {
        startAt: {
          gte: semester.startAt,
        },
        endAt: {
          lte: semester.endAt,
        },
        AND: [
          {
            OR: [
              { isBlocking: true },
              { assetId: event?.asset?.uuid },
              { staffId: event?.staff?.uuid },
            ],
          },
          {
            OR: [
              {
                startAt: {
                  lte: event.startAt,
                },
                endAt: {
                  gte: event.endAt,
                },
              },
              {
                startAt: {
                  lte: event.startAt,
                },
                endAt: {
                  lte: event.endAt,
                  gte: event.startAt,
                },
              },
              {
                startAt: {
                  gte: event.startAt,
                  lte: event.endAt,
                },
                endAt: {
                  gte: event.endAt,
                },
              },
            ],
          },
        ],
      },
    });
    return !blockingEvent;
  }
}
