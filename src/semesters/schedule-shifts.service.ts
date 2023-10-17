import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateScheduleShiftDto } from './dto/create-schedule-shift.dto';
import { AppAbility } from 'src/auth/auth.ability';
import { Action } from 'src/utils/action.enum';
import { AdminRouteException } from 'src/auth/exceptions/admin-route.exception';
import { Prisma } from '@prisma/client';
import { PrismaErrors } from 'src/utils/prisma-errors.enum';
import { UpdateScheduleShiftDto } from './dto/update-schedule-shift.dto';
import { accessibleBy } from '@casl/prisma';
import { CreateScheduleShiftTaskDto } from './dto/create-schedule-shift-task.dto';

@Injectable()
export class ScheduleShiftsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    scheduleId: string,
    createScheduleShiftDto: CreateScheduleShiftDto,
    ability: AppAbility,
    // TODO FIX USER TYPE
    user,
  ) {
    if (!ability.can(Action.Create, 'ScheduleShift')) {
      throw new AdminRouteException();
    }

    try {
      const { forStaff, ...data } = createScheduleShiftDto;
      const dateIdentifier = new Date(createScheduleShiftDto.startAt);
      dateIdentifier.setUTCHours(0, 0, 0, 0);
      const dataToCreate = {
        ...data,
        dateIdentifier,
        createdBy: {
          connect: { uuid: user.uuid },
        },
        schedule: {
          connect: { uuid: scheduleId },
        },
        userId: forStaff.uuid,
      };

      return await this.prisma.scheduleShift.create({ data: dataToCreate });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error?.code === PrismaErrors.UniqueConstraintError
      ) {
        throw new BadRequestException('Shift already exists');
      }
      throw new InternalServerErrorException(
        error,
        'Something went wrong when creating shift.',
      );
    }
  }

  async findAll(uuid: string, ability: AppAbility) {
    try {
      return await this.prisma.scheduleShift.findMany({
        where: {
          AND: [accessibleBy(ability).ScheduleShift, { scheduleId: uuid }],
        },
      });
    } catch (error) {
      throw new AdminRouteException();
    }
  }

  async update(
    uuid: string,
    updateScheduleShiftDto: UpdateScheduleShiftDto,
    ability: AppAbility,
    // TODO FIX USER TYPE
    user,
  ) {
    if (!ability.can(Action.Update, 'ScheduleShift')) {
      throw new AdminRouteException();
    }
    try {
      const dataToUpdate = {
        ...updateScheduleShiftDto,
        updatedBy: {
          connect: { uuid: user.uuid },
        },
      };
      return await this.prisma.scheduleShift.update({
        where: { uuid },
        data: dataToUpdate,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(uuid: string, ability: AppAbility) {
    if (!ability.can(Action.Delete, 'ScheduleShift')) {
      throw new AdminRouteException();
    }
    return await this.prisma.scheduleShift.delete({ where: { uuid } });
  }
}
