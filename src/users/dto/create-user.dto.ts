import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsString,
  IsNumberString,
  IsEnum,
  IsPhoneNumber,
  ValidateNested,
} from 'class-validator';

export class AddressDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  zipCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  area: string;
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
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsPhoneNumber('SE')
  phoneNumber: string;

  @ApiProperty()
  // @IsEnum(Role)
  @IsNotEmpty()
  role: string;

  // @ApiProperty({ required: false })
  // @IsOptional()
  // @IsNotEmpty()
  // isAdmin: boolean;
}
