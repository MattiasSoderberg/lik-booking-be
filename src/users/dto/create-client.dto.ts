import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayContains,
  IsArray,
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class Asset {
  @IsUUID()
  assetId: string;
}

export class Relative {
  @IsUUID()
  userId: string;
}

export class CreateClientDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsDateString()
  bornAt: Date;

  @ApiProperty()
  @IsArray()
  @IsObject({ each: true })
  @ValidateNested({
    message: ' must be an object with key "assetId" and value (string)',
  })
  @Type(() => Asset)
  assets: Asset[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  user: { uuid: string };

  @ApiProperty()
  @IsArray()
  @IsObject({ each: true })
  @ValidateNested({
    message: ' must be an object with key "userId" and value (string)',
  })
  @Type(() => Relative)
  relatives: Relative[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  note: string;
}
