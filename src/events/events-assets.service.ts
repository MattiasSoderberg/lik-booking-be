import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { Action } from 'src/utils/action.enum';
import { AdminRouteException } from 'src/auth/exceptions/admin-route.exception';
import { AppAbility } from 'src/auth/auth.ability';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { accessibleBy } from '@casl/prisma';
import { Prisma } from '@prisma/client';
import { PrismaErrors } from 'src/utils/prisma-errors.enum';
import { AssetExistsException } from './exceptions/asset-exists.exception';

@Injectable()
export class EventsAssetsService {
  constructor(private prisma: PrismaService) {}

  async create(createAssetDto: CreateAssetDto, ability: AppAbility) {
    if (!ability.can(Action.Manage, 'all')) {
      throw new AdminRouteException();
    }

    try {
      return await this.prisma.asset.create({ data: createAssetDto });
    } catch (error) {
      console.log('ERROR CREATING ASSET: ', error);
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error?.code === PrismaErrors.UniqueConstraintError
      ) {
        throw new AssetExistsException(createAssetDto.name);
      }
      throw new InternalServerErrorException(
        'Something went wrong when creating asset.',
      );
    }
  }

  findAll(ability: AppAbility) {
    try {
      return this.prisma.asset.findMany({ where: accessibleBy(ability).Asset });
    } catch (error) {
      throw new AdminRouteException();
    }
  }

  async findOne(uuid: string, ability: AppAbility) {
    try {
      const asset = await this.prisma.asset.findFirst({
        where: { AND: [accessibleBy(ability).Asset, { uuid }] },
      });
      if (!asset) {
        throw new NotFoundException('Asset not found');
      }
      return asset;
    } catch (error) {
      throw new AdminRouteException();
    }
  }

  update(uuid: string, updateAssetDto: UpdateAssetDto, ability: AppAbility) {
    if (!ability.can(Action.Manage, 'all')) {
      throw new AdminRouteException();
    }
    try {
      return this.prisma.asset.update({
        where: { uuid },
        data: updateAssetDto,
      });
    } catch (error) {
      console.log(error);
    }
  }

  remove(uuid: string, ability: AppAbility) {
    if (!ability.can(Action.Manage, 'all')) {
      throw new AdminRouteException();
    }
    try {
      return this.prisma.asset.delete({ where: { uuid } });
    } catch (error) {
      console.log(error);
    }
  }
}
