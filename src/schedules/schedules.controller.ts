import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateSemesterDto } from './dto/create-semester.dto';

@ApiTags('Schedules')
@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post('semesters')
  createSemester(@Body() createSemesterDto: CreateSemesterDto) {
    return this.schedulesService.createSemester(createSemesterDto);
  }

  @Get('semesters')
  findAllSemesters() {
    return this.schedulesService.findAllSemesters();
  }

  @Post()
  create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.schedulesService.create(createScheduleDto);
  }

  @Get()
  findAll() {
    return this.schedulesService.findAll();
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.schedulesService.findOne(uuid);
  }

  @Patch(':uuid')
  update(
    @Param('uuid') uuid: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.schedulesService.update(uuid, updateScheduleDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.schedulesService.remove(uuid);
  }
}
