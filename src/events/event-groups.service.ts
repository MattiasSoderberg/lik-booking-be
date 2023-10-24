import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventGroupDto } from './dto/create-event-group.dto';
import { AppAbility } from 'src/auth/auth.ability';
import { accessibleBy } from '@casl/prisma';
import { Action } from 'src/utils/action.enum';
import { Weekdays } from 'src/utils/weekdays.enum';
import { Prisma } from '@prisma/client';
import { PrismaErrors } from 'src/utils/prisma-errors.enum';
import { AdminRouteException } from 'src/auth/exceptions/admin-route.exception';

@Injectable()
export class EventGroupsService {
  constructor(private prisma: PrismaService) {}

  async create(createEventGroupDto: CreateEventGroupDto, ability: AppAbility) {
    if (!ability.can(Action.Create, 'EventGroup')) {
      throw new ForbiddenException();
    }
    try {
      const { weekday, semesterPeriod, semesterYear, ...data } =
        createEventGroupDto;

      const dataToCreate = {
        ...data,
        weekday: Weekdays[weekday],
        semester: {
          connect: {
            semester_identifier: {
              year: parseInt(semesterYear),
              period: semesterPeriod,
            },
          },
        },
      };
      return await this.prisma.eventGroup.create({ data: dataToCreate });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error?.code === PrismaErrors.RecordNotFound
      ) {
        throw new BadRequestException('Semester not found.');
      }
      throw new BadRequestException();
    }
  }

  async findAll(ability: AppAbility) {
    return await this.prisma.eventGroup.findMany({
      where: accessibleBy(ability).EventGroup,
    });
  }

  async findOne(uuid: string, ability: AppAbility) {
    return await this.prisma.eventGroup.findFirst({
      where: { AND: [accessibleBy(ability).EventGroup, { uuid }] },
    });
  }

  async remove(uuid: string, ability: AppAbility) {
    if (!ability.can(Action.Delete, 'EventGroup')) {
      throw new AdminRouteException();
    }
    return await this.prisma.eventGroup.delete({ where: { uuid } });
  }
}
