import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum } from 'class-validator';

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

  @ApiProperty({ enum: SemesterPeriod })
  @IsEnum(SemesterPeriod)
  period: SemesterPeriod;
}
