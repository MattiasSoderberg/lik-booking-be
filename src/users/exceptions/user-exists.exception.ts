import { BadRequestException } from '@nestjs/common';

export class UserExistsException extends BadRequestException {
  constructor(email?: string) {
    super(`User with that email already exists`);
  }
}
