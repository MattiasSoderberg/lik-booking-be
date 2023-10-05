import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, Min } from 'class-validator';

enum SemesterPeriod {
  Spring = 'SPRING',
  Fall = 'FALL',
}

export class CreateSemesterDto {
  @ApiProperty()
  @IsDateString()
  startAt: Date;

  @ApiProperty()
  @IsDateString()
  endAt: Date;

  // @ApiProperty()
  // @IsInt()
  // @Min(new Date().getFullYear())
  // year: number;

  @ApiProperty({ enum: SemesterPeriod })
  @IsEnum(SemesterPeriod)
  period: SemesterPeriod;
}
