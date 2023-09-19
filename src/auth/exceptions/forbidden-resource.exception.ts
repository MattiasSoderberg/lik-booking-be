import { ForbiddenException } from '@nestjs/common';

export class ForbiddenResourceException extends ForbiddenException {
  constructor() {
    super('Forbidden resource.');
  }
}
