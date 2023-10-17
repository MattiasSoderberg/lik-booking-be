import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateScheduleShiftTaskDto } from './dto/create-schedule-shift-task.dto';
import { AppAbility } from 'src/auth/auth.ability';
import { UpdateScheduleShiftTaskDto } from './dto/update-schedule-shift-task.dto';

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
    return 'Creating schedule shift task';
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
}
