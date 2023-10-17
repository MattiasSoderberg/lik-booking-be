import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsObject,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class RelationEntity {
  @IsUUID()
  uuid: string;
}

export class CreateScheduleTaskDto {
  @ApiProperty()
  @IsDateString()
  startAt: Date;

  @ApiProperty()
  @IsDateString()
  endAt: Date;

  @ApiProperty()
  @ValidateNested({
    message: ' must be an object with key "uuid" and value (string)',
  })
  @IsObject({ each: true })
  @Type(() => RelationEntity)
  scheduleShift: RelationEntity;
}
