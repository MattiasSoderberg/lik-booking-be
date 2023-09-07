import { ApiProperty } from '@nestjs/swagger';

enum AssetStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}

export class CreateAssetDto {
  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: true, enum: AssetStatus })
  status: AssetStatus;

  @ApiProperty({ required: false })
  note: string;
}
