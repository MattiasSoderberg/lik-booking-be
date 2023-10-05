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

@ApiTags('Semesters')
@Controller('semesters')
export class SemestersController {
  constructor(private readonly semestersService: SemestersService) {}

  @Post()
  create(
    @Body(DatePeriodValidationPipe, DateOverlapValidationPipe)
    createSemesterDto: CreateSemesterDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const { ability } = req;
    return this.semestersService.create(createSemesterDto, ability);
  }

  @Get()
  findAll(@Request() req: AuthenticatedRequest) {
    const { ability } = req;
    return this.semestersService.findAll(ability);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.semestersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSemesterDto: UpdateSemesterDto,
  ) {
    return this.semestersService.update(+id, updateSemesterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.semestersService.remove(+id);
  }
}
