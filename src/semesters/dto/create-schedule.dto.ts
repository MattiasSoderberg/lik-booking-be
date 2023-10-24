import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
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

class RelationEntity {
  @IsUUID()
  uuid: string;
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
}
