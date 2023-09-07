import { Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSemesterDto } from './dto/create-semester.dto';

@Injectable()
export class SchedulesService {
  constructor(private prisma: PrismaService) {}

  createSemester(createSemesterDto: CreateSemesterDto) {
    return 'Create semester';
  }

  findAllSemesters() {
    return this.prisma.semester.findMany({});
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
