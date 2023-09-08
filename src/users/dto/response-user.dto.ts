import { $Enums, User } from '@prisma/client';
import { Exclude } from 'class-transformer';
export class UserResponseDto implements User {
  uuid: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: $Enums.Role;
  isAdmin: boolean;

  @Exclude()
  password: string;
}
