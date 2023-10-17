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

@ApiTags('Semesters')
@Controller('semesters')
export class SemestersController {
  constructor(
    private readonly semestersService: SemestersService,
    private readonly schedulesService: SchedulesService,
    private readonly scheduleShiftsService: ScheduleShiftsService,
  ) {}

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

  @Delete('schedules/:uuid')
  removeSchedule(
    @Param('uuid') uuid: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const { ability } = req;
    return this.schedulesService.remove(uuid, ability);
  }

  @Post('schedules/:uuid/schedule-shifts')
  createScheduleShift(
    @Param('uuid') uuid: string,
    @Body() createScheduleShiftDto: CreateScheduleShiftDto,
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

  @Get('schedules/:uuid/schedule-shifts')
  findAllScheduleShifts(
    @Param('uuid') uuid: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const { ability } = req;
    return this.scheduleShiftsService.findAll(uuid, ability);
  }

  @Patch('schedules/schedule-shifts/:uuid')
  updateScheduleShift(
    @Param('uuid') uuid: string,
    @Body() updateScheduleShiftDto: UpdateScheduleShiftDto,
    @Request() req: AuthenticatedRequest,
  ) {
    console.log('SCHEDULE PATCH', uuid);
    const { ability, user } = req;
    return this.scheduleShiftsService.update(
      uuid,
      updateScheduleShiftDto,
      ability,
      user,
    );
  }

  @Delete('schedules/schedule-shifts/:uuid')
  deleteScheduleShift(
    @Param('uuid') uuid: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const { ability } = req;
    return this.scheduleShiftsService.remove(uuid, ability);
  }

  @Post(':semesterUuid/schedules')
  createSchedule(
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

  @Get(':semesterUuid/schedules')
  findAllSchedules(
    @Param('semesterUuid') semesterUuid: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const { ability } = req;
    return this.schedulesService.findAllBySemester(semesterUuid, ability);
  }
}
