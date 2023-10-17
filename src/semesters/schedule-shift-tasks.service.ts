import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateScheduleShiftTaskDto } from './dto/create-schedule-shift-task.dto';
import { AppAbility } from 'src/auth/auth.ability';
import { UpdateScheduleShiftTaskDto } from './dto/update-schedule-shift-task.dto';
import { Action } from 'src/utils/action.enum';
import { AdminRouteException } from 'src/auth/exceptions/admin-route.exception';

@Injectable()
export class ScheduleShiftTasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    uuid: string,
    createScheduleShiftTaskDto: CreateScheduleShiftTaskDto,
    ability: AppAbility,
    // TODO FIX USER TYPE
    user,
  ) {
    if (!ability.can(Action.Create, 'ScheduleShiftTask')) {
      throw new AdminRouteException();
    }
    try {
      await this.taskWithinShiftValidation(createScheduleShiftTaskDto, uuid);
      const dataToCreate = {
        ...createScheduleShiftTaskDto,
        scheduleShift: {
          connect: { uuid },
        },
      };

      return await this.prisma.scheduleShiftTask.create({ data: dataToCreate });
    } catch (error) {
      if (error?.response) {
        throw new BadRequestException(error.response);
      }
    }
  }

  async update(
    uuid: string,
    updateScheduleShiftTaskDto: UpdateScheduleShiftTaskDto,
    ability: AppAbility,
    // TODO FIX USER TYPE
    user,
  ) {}

  async findAllByScheduleShift(uuid: string, ability: AppAbility) {}

  async findAllBySchedule(uuid: string, ability: AppAbility) {}

  async remove(uuid: string, ability: AppAbility) {}

  private async taskWithinShiftValidation(
    task: CreateScheduleShiftTaskDto,
    scheduleShiftUuid: string,
  ) {
    const shift = await this.prisma.scheduleShift.findFirst({
      where: { uuid: scheduleShiftUuid },
    });
    const taskStartAt = new Date(task.startAt);
    const taskEndAt = new Date(task.endAt);

    if (taskStartAt < shift.startAt || taskEndAt > shift.endAt) {
      throw new BadRequestException('Task date must be within shift date');
    }
    // return true;
  }
}
