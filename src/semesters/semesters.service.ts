import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateSemesterDto } from './dto/create-semester.dto';
import { UpdateSemesterDto } from './dto/update-semester.dto';
import { AppAbility } from 'src/auth/auth.ability';
import { Action } from 'src/utils/action.enum';
import { AdminRouteException } from 'src/auth/exceptions/admin-route.exception';
import { Prisma } from '@prisma/client';
import { PrismaErrors } from 'src/utils/prisma-errors.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { accessibleBy } from '@casl/prisma';
import { HolidayWeeks } from 'src/utils/constants.enum';
import { EventsService } from 'src/events/events.service';
import { AuthenticatedUser } from 'src/auth/auth.interface';

@Injectable()
export class SemestersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsService: EventsService,
  ) {}

  async create(
    createSemesterDto: CreateSemesterDto,
    ability: AppAbility,
    user: AuthenticatedUser,
  ) {
    if (!ability.can(Action.Create, 'Semester')) {
      throw new AdminRouteException();
    }

    try {
      const year = new Date(createSemesterDto.startAt).getFullYear();
      const holiday = HolidayWeeks[createSemesterDto.period];
      const holidayDates = this.weekToDates(year, holiday);
      const eventToCreate = {
        ...holidayDates,
        isBlocking: true,
        note: `${createSemesterDto.period} holiday`,
      };

      const semester = await this.prisma.semester.create({
        data: { ...createSemesterDto, year },
      });

      if (semester) {
        await this.eventsService.create(eventToCreate, ability, user);
      }

      return semester;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error?.code === PrismaErrors.UniqueConstraintError
      ) {
        throw new BadRequestException('Semester already exists.');
      }
      throw new InternalServerErrorException(
        'Something went wrong creating semester.',
      );
    }
  }

  async findAll(ability: AppAbility) {
    try {
      return await this.prisma.semester.findMany({
        where: accessibleBy(ability).Semester,
      });
    } catch (error) {
      throw new AdminRouteException();
    }
  }

  //TODO Add findOneByYear and update
  findOne(id: number) {
    return `This action returns a #${id} semester`;
  }

  update(id: number, updateSemesterDto: UpdateSemesterDto) {
    return `This action updates a #${id} semester`;
  }

  async remove(uuid: string, ability: AppAbility) {
    if (!ability.can(Action.Delete, 'Semester')) {
      throw new AdminRouteException();
    }
    return await this.prisma.semester.delete({ where: { uuid } });
  }

  private weekToDates(year: number, week: number) {
    const yearStartAt = new Date(`${year}-01-01`);
    const daysToFirstMonday =
      yearStartAt.getDay() < 1
        ? 1
        : yearStartAt.getDay() > 1
        ? 7 - yearStartAt.getDay() + 1
        : 0;
    yearStartAt.setDate(yearStartAt.getDate() + daysToFirstMonday);
    const daysToWeek = week * 7 - 7;
    const startAt = new Date(yearStartAt);
    startAt.setDate(startAt.getDate() + daysToWeek);
    const endAt = new Date(startAt);
    endAt.setDate(endAt.getDate() + 6);
    endAt.setUTCHours(23, 59, 59, 999);

    return { startAt, endAt };
  }
}
