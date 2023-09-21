import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { AppAbility } from 'src/auth/auth.ability';
import { Action } from 'src/utils/action.enum';
import { AdminRouteException } from 'src/auth/exceptions/admin-route.exception';
import { accessibleBy } from '@casl/prisma';
import { UpdateClientDto } from './dto/update-client.dto';
import { ForbiddenResourceException } from 'src/auth/exceptions/forbidden-resource.exception';
import { Prisma } from '@prisma/client';
import { PrismaErrors } from 'src/utils/prisma-errors.enum';

@Injectable()
export class UsersClientsService {
  constructor(private prisma: PrismaService) {}

  async create(createClientDto: CreateClientDto, ability: AppAbility) {
    if (!ability.can(Action.Create, 'Client')) {
      throw new AdminRouteException();
    }

    const { assets, relatives, user, ...clientData } = createClientDto;

    try {
      const client = await this.prisma.client.create({
        data: {
          ...clientData,
          relatives: {
            createMany: { data: relatives },
          },
          assets: {
            createMany: { data: assets },
          },
        },
        include: { relatives: true, assets: true },
      });
      return client;
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong when creating client.',
      );
    }
  }

  async findAll(ability: AppAbility) {
    try {
      return await this.prisma.client.findMany({
        where: accessibleBy(ability).Client,
        include: {
          relatives: { include: { user: true } },
          assets: { include: { asset: true } },
        },
      });
    } catch (error) {
      throw new ForbiddenResourceException();
    }
  }

  async findOne(uuid: string, ability: AppAbility) {
    try {
      return await this.prisma.client.findFirst({
        where: { AND: [accessibleBy(ability).Client, { uuid }] },
        include: {
          relatives: { include: { user: true } },
          assets: { include: { asset: true } },
        },
      });
    } catch (error) {
      throw new ForbiddenResourceException();
    }
  }

  async update(
    uuid: string,
    updateClientDto: UpdateClientDto,
    ability: AppAbility,
  ) {
    if (!ability.can(Action.Update, 'Client')) {
      throw new AdminRouteException();
    }
    const { assets, relatives, user, ...clientData } = updateClientDto;
    const dataToUpdate = { ...clientData };

    if (assets && assets.length > 0) {
      dataToUpdate['assets'] = {
        createMany: {
          data: assets,
        },
      };
    }

    if (relatives && relatives.length > 0) {
      dataToUpdate['relatives'] = {
        createMany: { data: relatives },
      };
    }

    try {
      return await this.prisma.client.update({
        where: { uuid },
        data: dataToUpdate,
        include: {
          relatives: { include: { user: true } },
          assets: { include: { asset: true } },
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error?.code === PrismaErrors.UniqueConstraintError
      ) {
        if (error?.meta?.target[0] === 'clientId') {
          throw new BadRequestException('Client already has that asset.');
        }
        if (error?.meta?.target[0] === 'userId') {
          throw new BadRequestException('Client already has that relative.');
        }
      }
    }
  }

  async removeClientAsset(
    uuid: string,
    updateClientDto: UpdateClientDto,
    ability: AppAbility,
  ) {
    if (!ability.can(Action.Update, 'Client')) {
      throw new AdminRouteException();
    }

    const client = await this.prisma.client.findFirst({
      where: { uuid },
      include: { assets: true },
    });
    const { assets } = updateClientDto;

    if (
      client.assets.length <= 1 &&
      client.assets[0].assetId === assets[0].assetId
    ) {
      throw new BadRequestException('Client must have at least one asset.');
    }

    try {
      return await this.prisma.client.update({
        where: { uuid },
        data: {
          assets: {
            deleteMany: assets,
          },
        },
        include: {
          relatives: { include: { user: true } },
          assets: { include: { asset: true } },
        },
      });
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async removeClientRelative(
    uuid: string,
    updateClientDto: UpdateClientDto,
    ability: AppAbility,
  ) {
    if (!ability.can(Action.Update, 'Client')) {
      throw new AdminRouteException();
    }

    const client = await this.prisma.client.findFirst({
      where: { uuid },
      include: { relatives: true },
    });
    const { relatives } = updateClientDto;

    if (
      client.relatives.length <= 1 &&
      client.relatives[0].userId === relatives[0].userId
    ) {
      throw new BadRequestException('Client must have at least one relative.');
    }

    try {
      return await this.prisma.client.update({
        where: { uuid },
        data: {
          relatives: {
            deleteMany: relatives,
          },
        },
        include: {
          relatives: { include: { user: true } },
          assets: { include: { asset: true } },
        },
      });
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async remove(uuid: string, ability: AppAbility) {
    if (!ability.can(Action.Delete, 'Client')) {
      throw new AdminRouteException();
    }
    return await this.prisma.client.delete({ where: { uuid } });
  }
}
