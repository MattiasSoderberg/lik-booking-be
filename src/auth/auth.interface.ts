import { User } from '@prisma/client';
import { AppAbility } from './auth.ability';
import { Request } from 'express';

export type AuthenticatedUser = {
  user: User;
  ability: AppAbility;
};

export type AuthenticatedRequest = AuthenticatedUser & Request;
