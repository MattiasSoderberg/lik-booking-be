import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { hash } from 'bcrypt';
import { Prisma, User } from '@prisma/client';
import { PrismaErrors } from 'src/utils/prisma-errors.enum';
import { UserExistsException } from './exceptions/user-exists.exception';
import { RoleEnum } from 'src/utils/role.enum';
import { AppAbility } from 'src/auth/auth.ability';
import { accessibleBy } from '@casl/prisma';
import { Action } from 'src/utils/action.enum';
import { AdminRouteException } from 'src/auth/exceptions/admin-route.exception';
import { ForbiddenResourceException } from 'src/auth/exceptions/forbidden-resource.exception';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createClient(createClientDto: CreateClientDto, ability: AppAbility) {
    if (ability.can(Action.Manage, 'all')) {
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

  findAllClients(ability: AppAbility) {
    if (!ability.can(Action.Read, 'Client')) {
      throw new ForbiddenResourceException();
    }
    return this.prisma.client.findMany({
      include: {
        relatives: { include: { user: true } },
        assets: { include: { asset: true } },
      },
    });
  }

  findOneClient(uuid: string, ability: AppAbility) {
    if (!ability.can(Action.Read, 'Client')) {
      throw new ForbiddenResourceException();
    }
    try {
      return this.prisma.client.findFirst({
        where: { AND: [accessibleBy(ability).Client, { uuid }] },
      });
    } catch (error) {
      throw new ForbiddenResourceException();
    }
  }

  async createUser(createUserDto: CreateUserDto, ability: AppAbility) {
    const { address, role, ...userdata } = createUserDto;
    const hashedPassword = await hash(userdata.password, 10);
    userdata.password = hashedPassword;

    if (!ability.can(Action.Manage, 'all')) {
      throw new AdminRouteException();
    }

    const dataToCreate = {
      ...userdata,
      role: { connect: { id: RoleEnum[role] } },
    };

    if (address) {
      const { street, zipCode, area } = address;
      dataToCreate['address'] = {
        connectOrCreate: {
          where: { address_identifier: { street, zipCode, area } },
          create: address,
        },
      };
    }

    try {
      const user = await this.prisma.user.create({
        data: dataToCreate,
        include: { address: true },
      });

      return user;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error?.code === PrismaErrors.UniqueConstraintError
      ) {
        throw new UserExistsException(createUserDto.email);
      }
      throw new InternalServerErrorException(
        'Something went wrong when creating user.',
      );
    }
  }

  findMe(user: User) {
    return user;
  }

  findAllUsers(ability: AppAbility) {
    try {
      return this.prisma.user.findMany({ where: accessibleBy(ability).User });
    } catch (error) {
      throw new ForbiddenResourceException();
    }
  }

  findOneUser(uuid: string, ability: AppAbility) {
    try {
      return this.prisma.user.findFirst({
        where: {
          AND: [accessibleBy(ability).User, { uuid }],
        },
      });
    } catch (error) {
      throw new ForbiddenResourceException();
    }
  }

  async findOneUserByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email: email } });
  }

  updateUser(uuid: string, updateUserDto: UpdateUserDto) {
    const { address, role, ...userData } = updateUserDto;

    const dataToUpdate = {
      ...userData,
      role: { connect: { id: RoleEnum[role] } },
    };

    if (address) {
      dataToUpdate['address'] = {
        upsert: {
          where: { uuid },
          create: address,
          update: address,
        },
      };
    }

    return this.prisma.user.update({ where: { uuid }, data: dataToUpdate });
  }

  removeUser(uuid: string) {
    return `This action removes a #${uuid} user`;
  }

  async getUserWPermissions(uuid: string) {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { uuid },
        include: { role: { include: { permissions: true } } },
      });

      return user;
    } catch (error) {
      throw new NotFoundException(`User with uuid ${uuid} not found.`);
    }
  }
}
