import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
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

export class CreateEventDto {
  @ApiProperty()
  @IsDateString()
  startAt: Date;

  @ApiProperty()
  @IsDateString()
  endAt: Date;

  @ApiProperty()
  @IsOptional()
  @IsString()
  note: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @ApiProperty({
    description:
      'Blocking events are for blocking date span for other events. Eg. Closed for holiday.',
  })
  @IsBoolean()
  @IsOptional()
  isBlocking: boolean;

  @ApiProperty()
  @IsOptional()
  @IsObject({ each: true })
  @ValidateNested({
    message: ' must be an object with key "uuid" and value (string)',
  })
  @Type(() => RelationEntity)
  asset: RelationEntity;

  @ApiProperty()
  @IsOptional()
  @IsObject({ each: true })
  @ValidateNested({
    message: ' must be an object with key "uuid" and value (string)',
  })
  @Type(() => RelationEntity)
  staff: RelationEntity;

  @ApiProperty()
  @IsOptional()
  @IsObject({ each: true })
  @ValidateNested({
    message: ' must be an object with key "uuid" and value (string)',
  })
  @Type(() => RelationEntity)
  client: RelationEntity;
}
