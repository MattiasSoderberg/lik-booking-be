import { BadRequestException } from '@nestjs/common';

export class AssetExistsException extends BadRequestException {
  constructor(name?: string) {
    super(`Asset with name ${name} already exists.`);
  }
}
