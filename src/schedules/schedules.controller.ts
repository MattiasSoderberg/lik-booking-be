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
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateSemesterDto } from './dto/create-semester.dto';
import { AuthenticatedRequest } from 'src/auth/auth.interface';
import { DatePeriodValidationPipe } from './pipes/date-period-validation.pipe';
import { DateOverlapValidationPipe } from './pipes/date-overlap-validation.pipe';

@ApiTags('Schedules')
@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post('semesters')
  createSemester(
    @Body(DatePeriodValidationPipe, DateOverlapValidationPipe)
    createSemesterDto: CreateSemesterDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const { ability } = req;
    return this.schedulesService.createSemester(createSemesterDto, ability);
  }

  @Get('semesters')
  findAllSemesters(@Request() req: AuthenticatedRequest) {
    const { ability } = req;
    return this.schedulesService.findAllSemesters(ability);
  }

  @Delete('semesters/:uuid')
  removeSemester(
    @Param('uuid') uuid: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const { ability } = req;
    return this.schedulesService.removeSemester(uuid, ability);
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
