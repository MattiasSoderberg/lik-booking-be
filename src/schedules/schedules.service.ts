import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSemesterDto } from './dto/create-semester.dto';
import { AppAbility } from 'src/auth/auth.ability';
import { Action } from 'src/utils/action.enum';
import { AdminRouteException } from 'src/auth/exceptions/admin-route.exception';
import { Prisma } from '@prisma/client';
import { PrismaErrors } from 'src/utils/prisma-errors.enum';
import { accessibleBy } from '@casl/prisma';

@Injectable()
export class SchedulesService {
  constructor(private prisma: PrismaService) {}

  async createSemester(
    createSemesterDto: CreateSemesterDto,
    ability: AppAbility,
  ) {
    if (!ability.can(Action.Create, 'Semester')) {
      throw new AdminRouteException();
    }

    const date = new Date(createSemesterDto.startAt);
    const year = date.getFullYear();

    try {
      return await this.prisma.semester.create({
        data: { ...createSemesterDto, year },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error?.code === PrismaErrors.UniqueConstraintError
      ) {
        throw new BadRequestException(
          `Period already exists on year: ${year}.`,
        );
      }
      throw new InternalServerErrorException(
        'Something went wrong when creating semester.',
      );
    }
  }

  async findAllSemesters(ability: AppAbility) {
    try {
      return await this.prisma.semester.findMany({
        where: accessibleBy(ability).Semester,
      });
    } catch (error) {
      throw new AdminRouteException();
    }
  }

  async removeSemester(uuid: string, ability: AppAbility) {
    if (!ability.can(Action.Delete, 'Semester')) {
      throw new AdminRouteException();
    }
    return await this.prisma.semester.delete({ where: { uuid } });
  }

  create(createScheduleDto: CreateScheduleDto) {
    return 'This action adds a new schedule';
  }

  findAll() {
    return `This action returns all schedules`;
  }

  findOne(uuid: string) {
    return `This action returns a #${uuid} schedule`;
  }

  update(uuid: string, updateScheduleDto: UpdateScheduleDto) {
    return `This action updates a #${uuid} schedule`;
  }

  remove(uuid: string) {
    return `This action removes a #${uuid} schedule`;
  }
}
