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
import { UserExists } from './exceptions/user-exists.exception';
import { RoleEnum } from 'src/utils/role.enum';
import { AppAbility } from 'src/auth/auth.ability';
import { accessibleBy } from '@casl/prisma';
import { Action } from 'src/utils/action.enum';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createClient(createClientDto: CreateClientDto) {
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
        'Something went wrong when creating clielnt.',
      );
    }
  }

  findAllClients() {
    return this.prisma.client.findMany({
      include: {
        relatives: { include: { user: true } },
        assets: { include: { asset: true } },
      },
    });
  }

  findOneClient(uuid) {
    return this.prisma.client.findUniqueOrThrow({ where: { uuid } });
  }

  async createUser(createUserDto: CreateUserDto, ability) {
    const { address, role, ...userdata } = createUserDto;
    const hashedPassword = await hash(userdata.password, 10);
    userdata.password = hashedPassword;

    if (!ability.can(Action.Manage, 'all')) {
      throw new ForbiddenException('Admin route');
    }

    try {
      const user = await this.prisma.user.create({
        data: {
          ...userdata,
          address: { create: address },
          role: { connect: { id: RoleEnum[role] } },
        },
        include: { address: true },
      });

      return user;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error?.code === PrismaErrors.UniqueConstraintError
      ) {
        throw new UserExists(createUserDto.email);
      }
      throw new InternalServerErrorException(
        'Something went wrong when creating user.',
      );
    }
  }

  findMe(ability: AppAbility, user: User) {
    return user;
  }

  findAllUsers(ability: AppAbility) {
    try {
      return this.prisma.user.findMany({ where: accessibleBy(ability).User });
    } catch (error) {
      console.log('FIND ALL ERROR', error);
    }
  }

  findOneUser(uuid: string, ability: AppAbility, user: User) {
    try {
      return this.prisma.user.findFirst({
        where: {
          AND: [accessibleBy(ability).User, { uuid }],
        },
      });
    } catch (error) {
      throw new ForbiddenException(error);
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
