import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  bornAt: Date;

  @ApiProperty()
  assets: string[];

  @ApiProperty({ required: false })
  schedules: string[];
}
