import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class RelationEntity {
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

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isBlocking: boolean;

  @ApiProperty()
  @IsOptional()
  @Type(() => RelationEntity)
  assetId: RelationEntity;

  @ApiProperty()
  @IsOptional()
  @Type(() => RelationEntity)
  staffId: RelationEntity;

  @ApiProperty()
  @IsOptional()
  @Type(() => RelationEntity)
  clientId: RelationEntity;
}
