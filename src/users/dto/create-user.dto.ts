import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

enum Role {
  Client = 'CLIENT',
  Relative = 'RELATIVE',
  Staff = 'STAFF',
}

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ enum: Role })
  @IsNotEmpty()
  role: Role;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  isAdmin: boolean;

  // @ApiProperty({ required: false })
  // client: string;
}
