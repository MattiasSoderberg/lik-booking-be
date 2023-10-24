import { Permission, Role, User } from '@prisma/client';
import { AppAbility } from './auth.ability';
import { Request } from 'express';

export interface PayloadRole extends Role {
  permissions: Permission[];
}

export interface Payload {
  user: {
    uuid: User['uuid'];
    role: PayloadRole;
  };
}

export type AuthenticatedUser = {
  uuid: User['uuid'];
};

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
  ability: AppAbility;
}
