import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';
export class UserResponseDto implements User {
  uuid: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  roleId: number;
  addressId: string;

  @Exclude()
  password: string;
}
