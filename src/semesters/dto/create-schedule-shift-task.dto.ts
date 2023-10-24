import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateScheduleShiftTaskDto {
  @ApiProperty()
  @IsDateString()
  startAt: Date;

  @ApiProperty()
  @IsDateString()
  endAt: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  note?: string;
}
