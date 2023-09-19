import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

enum AssetStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}

export class CreateAssetDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true, enum: AssetStatus })
  @IsOptional()
  @IsEnum(AssetStatus)
  status: AssetStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  note: string;
}
