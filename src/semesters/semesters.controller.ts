import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { SemestersService } from './semesters.service';
import { CreateSemesterDto } from './dto/create-semester.dto';
import { UpdateSemesterDto } from './dto/update-semester.dto';
import { DatePeriodValidationPipe } from './pipes/date-period-validation.pipe';
import { DateOverlapValidationPipe } from './pipes/date-overlap-validation.pipe';
import { AuthenticatedRequest } from 'src/auth/auth.interface';
import { ApiTags } from '@nestjs/swagger';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { ScheduleValidationPipe } from './pipes/schedule-validation.pipe';
import { CreateScheduleShiftDto } from './dto/create-schedule-shift.dto';
import { ScheduleShiftsService } from './schedule-shifts.service';
import { UpdateScheduleShiftDto } from './dto/update-schedule-shift.dto';
import { ScheduleShiftTasksService } from './schedule-shift-tasks.service';
import { CreateScheduleShiftTaskDto } from './dto/create-schedule-shift-task.dto';
import { UpdateScheduleShiftTaskDto } from './dto/update-schedule-shift-task.dto';
import { ScheduleShiftValidationPipe } from './pipes/schedule-shift-validation.pipe';
import { DateStartEndValidationPipe } from 'src/pipes/date-start-end-validation.pipe';

@ApiTags('Semesters')
/***
 * SEMESTER ROUTES
 *  ***/
@Controller('semesters')
export class SemestersController {
  constructor(private readonly semestersService: SemestersService) {}

  @Post()
  create(
    // @Body(DatePeriodValidationPipe, DateOverlapValidationPipe)
    @Body(DatePeriodValidationPipe)
    createSemesterDto: CreateSemesterDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const { ability, user } = req;
    return this.semestersService.create(createSemesterDto, ability, user);
  }

  @Get()
  findAll(@Request() req: AuthenticatedRequest) {
    const { ability } = req;
    return this.semestersService.findAll(ability);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.semestersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateSemesterDto: UpdateSemesterDto,
  // ) {
  //   return this.semestersService.update(+id, updateSemesterDto);
  // }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string, @Request() req: AuthenticatedRequest) {
    const { ability } = req;
    return this.semestersService.remove(uuid, ability);
  }
}

/***
 * SCHEDULE ROUTES
 *  ***/
@ApiTags('Semesters')
@Controller('semesters/:semesterUuid/schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post()
  create(
    @Param('semesterUuid') semesterUuid: string,
    @Body(ScheduleValidationPipe) createScheduleDto: CreateScheduleDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const { ability, user } = req;
    return this.schedulesService.create(
      semesterUuid,
      createScheduleDto,
      ability,
      user,
    );
  }

  @Get()
  findAllBySemester(
    @Param('semesterUuid') semesterUuid: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const { ability } = req;
    return this.schedulesService.findAllBySemester(semesterUuid, ability);
  }

  @Delete(':scheduleUuid')
  remove(
    @Param('scheduleUuid') scheduleUuid: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const { ability } = req;
    return this.schedulesService.remove(scheduleUuid, ability);
  }
}

/***
 * SCHEDULE SHIFT ROUTES
 *  ***/
@ApiTags('Semesters')
@Controller('semesters/:semesterUuid/schedules/:scheduleUuid/schedule-shifts')
export class ScheduleShiftsController {
  constructor(private readonly scheduleShiftsService: ScheduleShiftsService) {}

  @Post()
  create(
    @Param('scheduleUuid') uuid: string,
    @Body(DateStartEndValidationPipe, ScheduleShiftValidationPipe)
    createScheduleShiftDto: CreateScheduleShiftDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const { ability, user } = req;
    return this.scheduleShiftsService.create(
      uuid,
      createScheduleShiftDto,
      ability,
      user,
    );
  }

  @Get()
  findAllBySchedule(
    @Param('scheduleUuid') uuid: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const { ability } = req;
    return this.scheduleShiftsService.findAllBySchedule(uuid, ability);
  }

  @Patch(':scheduleShiftUuid')
  update(
    @Param('scheduleShiftUuid') uuid: string,
    @Body() updateScheduleShiftDto: UpdateScheduleShiftDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const { ability, user } = req;
    return this.scheduleShiftsService.update(
      uuid,
      updateScheduleShiftDto,
      ability,
      user,
    );
  }

  @Delete(':scheduleShiftUuid')
  delete(
    @Param('scheduleShiftUuid') uuid: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const { ability } = req;
    return this.scheduleShiftsService.remove(uuid, ability);
  }
}

/***
 * SCHEDULE SHIFT TASK ROUTES
 *  ***/
@ApiTags('Semesters')
@Controller(
  'semesters/:semesterUuid/schedules/:scheduleUuid/schedule-shifts/:scheduleShiftUuid/schedule-shift-tasks',
)
export class ScheduleShiftTasksController {
  constructor(
    private readonly scheduleShiftTasksService: ScheduleShiftTasksService,
  ) {}

  @Post()
  create(
    @Param('scheduleShiftUuid') uuid: string,
    @Body(DateStartEndValidationPipe)
    createScheduleShiftTaskDto: CreateScheduleShiftTaskDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const { ability, user } = req;
    return this.scheduleShiftTasksService.create(
      uuid,
      createScheduleShiftTaskDto,
      ability,
      user,
    );
  }

  @Patch(':scheduleShiftTaskUuid')
  update(
    @Param('scheduleShiftTaskUuid') uuid: string,
    @Body() updateScheduleTaskDto: UpdateScheduleShiftTaskDto,
    @Request() req: AuthenticatedRequest,
  ) {}

  @Delete(':scheduleShiftTaskUuid')
  remove(
    @Param('scheduleShiftTaskUuid') uuid: string,
    @Request() req: AuthenticatedRequest,
  ) {}
}
