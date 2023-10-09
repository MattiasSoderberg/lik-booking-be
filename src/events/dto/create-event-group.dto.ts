import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsMilitaryTime,
  IsNumberString,
  Length,
} from 'class-validator';
import { SemesterPeriods } from 'src/utils/constants.enum';

enum Weekday {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export class CreateEventGroupDto {
  @ApiProperty()
  @IsMilitaryTime()
  startAt: string;

  @ApiProperty()
  @IsMilitaryTime()
  endAt: string;

  @ApiProperty({ enum: Weekday })
  @IsEnum(Weekday)
  weekday: Weekday;

  @ApiProperty({ enum: SemesterPeriods })
  @IsEnum(SemesterPeriods)
  semesterPeriod: SemesterPeriods;

  @ApiProperty()
  @IsNumberString()
  @Length(4, 4)
  semesterYear: string;
}
