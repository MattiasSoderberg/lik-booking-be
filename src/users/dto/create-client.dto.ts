import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayContains,
  IsArray,
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class Asset {
  @IsUUID()
  assetId: string;
}

class Relative {
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
  @ValidateNested({ each: true })
  @Type(() => Asset)
  assets: Asset[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  user: { uuid: string };

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Relative)
  relatives: Relative[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  note: string;
}
