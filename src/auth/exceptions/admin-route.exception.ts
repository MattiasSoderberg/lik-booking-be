import { ForbiddenException } from '@nestjs/common';

export class AdminRouteException extends ForbiddenException {
  constructor() {
    super('Admin route.');
  }
}
