import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsMilitaryTime,
  IsObject,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';

enum SemesterPlan {
  FULL = 'FULL',
  HALF = 'HALF',
  STAFF = 'STAFF',
}

enum Weekday {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

class RelationEntity {
  @IsUUID()
  uuid: string;
}

export class WeekScheduleShift {
  @IsEnum(Weekday)
  weekday: Weekday;

  @IsMilitaryTime()
  startAt: string;

  @IsMilitaryTime()
  endAt: string;
}

export class CreateScheduleDto {
  @ApiProperty({ enum: SemesterPlan })
  @IsEnum(SemesterPlan)
  semesterPlan: SemesterPlan;

  @ApiProperty()
  @IsOptional()
  @ValidateNested({
    message: ' must be an object with key "uuid" and value (string)',
  })
  @IsObject({ each: true })
  @Type(() => RelationEntity)
  client?: RelationEntity;

  @ApiProperty()
  @IsOptional()
  @ValidateNested({
    message: ' must be an object with key "uuid" and value (string)',
  })
  @IsObject({ each: true })
  @Type(() => RelationEntity)
  staff?: RelationEntity;

  @ApiProperty()
  @IsOptional()
  @ValidateNested({
    message: ' must be an object with key "uuid" and value (string)',
  })
  @IsObject({ each: true })
  @Type(() => RelationEntity)
  asset?: RelationEntity;

  @ApiProperty()
  @IsOptional()
  @ValidateNested({
    message: ' must be an object with key "uuid" and value (string)',
  })
  @IsObject({ each: true })
  @Type(() => RelationEntity)
  eventStaff?: RelationEntity;

  @ApiProperty()
  @IsOptional()
  @ValidateNested({
    message: ' must be an object with key "uuid" and value (string)',
  })
  @IsObject({ each: true })
  @Type(() => RelationEntity)
  eventGroup?: RelationEntity;

  @ApiProperty()
  @IsOptional()
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  @ValidateNested({
    message:
      ' must be an array of objects like: {weekday: "MONDAY", startAt: "08:00", endAt: "17:00"}',
  })
  @Type(() => WeekScheduleShift)
  weekSchedule?: WeekScheduleShift[];

  @ApiProperty()
  @IsOptional()
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  @ValidateNested({
    message:
      ' must be an array of objects like: {weekday: "MONDAY", startAt: "08:00", endAt: "17:00"}',
  })
  @Type(() => WeekScheduleShift)
  alternativeWeekSchedule?: WeekScheduleShift[];
}
