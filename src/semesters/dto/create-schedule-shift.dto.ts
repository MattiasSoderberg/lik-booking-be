import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class RelationEntity {
  @IsUUID()
  uuid: string;
}

export class CreateScheduleShiftDto {
  @ApiProperty()
  @IsDateString()
  startAt: Date;

  @ApiProperty()
  @IsDateString()
  endAt: Date;

  @ApiProperty()
  @IsOptional()
  @ValidateNested({
    message: ' must be an object with key "uuid" and value (string)',
  })
  @IsObject({ each: true })
  @Type(() => RelationEntity)
  forStaff: RelationEntity;

  @ApiProperty()
  @IsString()
  @IsOptional()
  note?: string;
}
