import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { AppAbility } from 'src/auth/auth.ability';
import { Action } from 'src/utils/action.enum';
import { AdminRouteException } from 'src/auth/exceptions/admin-route.exception';
import { accessibleBy } from '@casl/prisma';
import { UpdateClientDto } from './dto/update-client.dto';

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
            connectOrCreate: relatives.map((relative) => {
              return {
                where: relative,
                create: relative,
              };
            }),
          },
          assets: {
            connectOrCreate: assets.map((asset) => {
              return {
                where: asset,
                create: asset,
              };
            }),
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

  findAll(ability: AppAbility) {
    try {
      return this.prisma.client.findMany({
        where: accessibleBy(ability).Client,
        include: {
          relatives: { include: { user: true } },
          assets: { include: { asset: true } },
        },
      });
    } catch (error) {
      throw new AdminRouteException();
    }
  }

  findOne(uuid: string, ability: AppAbility) {
    try {
      return this.prisma.client.findFirst({
        where: { AND: [accessibleBy(ability).Client, { uuid }] },
      });
    } catch (error) {
      throw new AdminRouteException();
    }
  }

  update(uuid: string, updateClientDto: UpdateClientDto, ability: AppAbility) {}

  remove(uuid: string, ability: AppAbility) {
    if (!ability.can(Action.Delete, 'Client')) {
      throw new AdminRouteException();
    }
  }
}
